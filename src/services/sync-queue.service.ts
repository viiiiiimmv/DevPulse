import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";

import {
  syncGitHubRepositories,
  type GitHubSyncResult,
} from "@/src/services/github-sync.service";
import { emitUserEvent } from "@/src/services/realtime.service";

type SyncJobData = {
  userId: string;
  username?: string | null;
  accessToken: string;
};

type EnqueuedJob = {
  mode: "bullmq" | "memory";
  jobId: string;
};

type MemoryJobStatus = {
  state: "queued" | "active" | "completed" | "failed";
  result?: GitHubSyncResult;
  error?: string;
};

const globalQueue = globalThis as typeof globalThis & {
  devpulseRedisConnection?: IORedis;
  devpulseSyncQueue?: Queue<SyncJobData>;
  devpulseSyncWorker?: Worker<SyncJobData, GitHubSyncResult>;
  devpulseMemoryJobs?: Map<string, MemoryJobStatus>;
};

const memoryJobs = globalQueue.devpulseMemoryJobs ?? new Map<string, MemoryJobStatus>();
globalQueue.devpulseMemoryJobs = memoryJobs;

function getRedisConnection() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!globalQueue.devpulseRedisConnection) {
    globalQueue.devpulseRedisConnection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }

  return globalQueue.devpulseRedisConnection;
}

function getBullQueue() {
  const connection = getRedisConnection();
  if (!connection) {
    return null;
  }

  if (!globalQueue.devpulseSyncQueue) {
    globalQueue.devpulseSyncQueue = new Queue<SyncJobData>("devpulse-github-sync", {
      connection,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: "exponential",
          delay: 30_000,
        },
        removeOnComplete: {
          age: 60 * 60,
          count: 100,
        },
        removeOnFail: {
          age: 24 * 60 * 60,
          count: 100,
        },
      },
    });
  }

  return globalQueue.devpulseSyncQueue;
}

function ensureWorker() {
  const connection = getRedisConnection();
  if (!connection || globalQueue.devpulseSyncWorker) {
    return;
  }

  globalQueue.devpulseSyncWorker = new Worker<SyncJobData, GitHubSyncResult>(
    "devpulse-github-sync",
    async (job: Job<SyncJobData>) => {
      emitUserEvent(job.data.userId, {
        type: "GITHUB_SYNC_JOB_ACTIVE",
        payload: { jobId: job.id },
      });

      return syncGitHubRepositories({
        ...job.data,
        background: true,
      });
    },
    { connection },
  );

  globalQueue.devpulseSyncWorker.on("failed", (job, error) => {
    if (!job) {
      return;
    }

    emitUserEvent(job.data.userId, {
      type: "GITHUB_SYNC_JOB_FAILED",
      payload: {
        jobId: job.id,
        error: error.message,
      },
    });
  });
}

export async function enqueueGitHubSyncJob(data: SyncJobData): Promise<EnqueuedJob> {
  const queue = getBullQueue();

  if (queue) {
    ensureWorker();
    const job = await queue.add("sync-user-repositories", data);
    emitUserEvent(data.userId, {
      type: "GITHUB_SYNC_JOB_QUEUED",
      payload: { jobId: job.id, mode: "bullmq" },
    });
    return { mode: "bullmq", jobId: String(job.id) };
  }

  const jobId = `memory-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  memoryJobs.set(jobId, { state: "queued" });
  emitUserEvent(data.userId, {
    type: "GITHUB_SYNC_JOB_QUEUED",
    payload: { jobId, mode: "memory" },
  });

  setTimeout(async () => {
    memoryJobs.set(jobId, { state: "active" });
    emitUserEvent(data.userId, {
      type: "GITHUB_SYNC_JOB_ACTIVE",
      payload: { jobId, mode: "memory" },
    });

    try {
      const result = await syncGitHubRepositories({
        ...data,
        background: true,
      });
      memoryJobs.set(jobId, { state: "completed", result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      memoryJobs.set(jobId, { state: "failed", error: message });
      emitUserEvent(data.userId, {
        type: "GITHUB_SYNC_JOB_FAILED",
        payload: { jobId, mode: "memory", error: message },
      });
    }
  }, 0);

  return { mode: "memory", jobId };
}

export async function scheduleGitHubSyncJob(
  data: SyncJobData,
  intervalHours: number,
): Promise<EnqueuedJob> {
  const every = Math.min(Math.max(intervalHours, 1), 24 * 7) * 60 * 60 * 1000;
  const queue = getBullQueue();

  if (queue) {
    ensureWorker();
    const job = await queue.add("scheduled-sync-user-repositories", data, {
      repeat: {
        every,
      },
      jobId: `scheduled-${data.userId}`,
    });

    emitUserEvent(data.userId, {
      type: "GITHUB_SYNC_SCHEDULED",
      payload: { jobId: job.id, mode: "bullmq", intervalHours },
    });

    return { mode: "bullmq", jobId: String(job.id) };
  }

  const jobId = `memory-scheduled-${data.userId}`;
  setInterval(() => {
    void enqueueGitHubSyncJob(data);
  }, every);
  memoryJobs.set(jobId, { state: "queued" });
  emitUserEvent(data.userId, {
    type: "GITHUB_SYNC_SCHEDULED",
    payload: { jobId, mode: "memory", intervalHours },
  });

  return { mode: "memory", jobId };
}

export async function getGitHubSyncJobStatus(jobId: string) {
  const queue = getBullQueue();

  if (queue && !jobId.startsWith("memory-")) {
    const job = await queue.getJob(jobId);
    if (!job) {
      return null;
    }

    return {
      mode: "bullmq",
      jobId,
      state: await job.getState(),
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  const status = memoryJobs.get(jobId);
  return status ? { mode: "memory", jobId, ...status } : null;
}
