import { prisma } from "@/src/server/prisma/client";

type Interval = "daily" | "weekly" | "monthly";

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addMonths(date: Date, months: number) {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

function startOfWeek(date: Date) {
  const value = startOfDay(date);
  const day = value.getDay();
  const daysSinceMonday = (day + 6) % 7;
  return addDays(value, -daysSinceMonday);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function bucketKey(date: Date, interval: Interval) {
  if (interval === "daily") {
    return date.toISOString().slice(0, 10);
  }

  if (interval === "weekly") {
    return startOfWeek(date).toISOString().slice(0, 10);
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function bucketLabel(date: Date, interval: Interval) {
  if (interval === "daily") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  if (interval === "weekly") {
    return `Week of ${new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getBucketStarts(interval: Interval, bucketCount: number) {
  const now = new Date();

  if (interval === "daily") {
    const first = addDays(startOfDay(now), -(bucketCount - 1));
    return Array.from({ length: bucketCount }, (_, index) => addDays(first, index));
  }

  if (interval === "weekly") {
    const first = addDays(startOfWeek(now), -7 * (bucketCount - 1));
    return Array.from({ length: bucketCount }, (_, index) => addDays(first, index * 7));
  }

  const first = addMonths(startOfMonth(now), -(bucketCount - 1));
  return Array.from({ length: bucketCount }, (_, index) => addMonths(first, index));
}

export async function getCommitsStats(userId: string) {
  try {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const sevenDaysAgo = addDays(new Date(), -7);
    const thirtyDaysAgo = addDays(new Date(), -30);

    const [totalCommits, monthlyCommits, weeklyCommits, dailyCommits] =
      await Promise.all([
        prisma.commit.count({
          where: {
            repository: {
              ownerId: userId,
            },
          },
        }),

        prisma.commit.count({
          where: {
            committedAt: {
              gte: thirtyDaysAgo,
            },
            repository: {
              ownerId: userId,
            },
          },
        }),

        prisma.commit.count({
          where: {
            committedAt: {
              gte: sevenDaysAgo,
            },
            repository: {
              ownerId: userId,
            },
          },
        }),

        prisma.commit.count({
          where: {
            committedAt: {
              gte: today,
              lt: tomorrow,
            },
            repository: {
              ownerId: userId,
            },
          },
        }),
      ]);

    return {
      totalCommits,
      monthlyCommits,
      monthlycommits: monthlyCommits,
      weeklyCommits,
      dailyCommits,
    };
  } catch (error) {
    console.error("failed to fetch commits data : ", error);
    throw new Error("Failed to fetch commits data");
  }
}

export async function getCommitTimeline(
  userId: string,
  interval: Interval,
  bucketCount = interval === "daily" ? 30 : 12,
) {
  const buckets = getBucketStarts(interval, bucketCount);
  const firstBucketStart = buckets[0];
  const counts = new Map(
    buckets.map((date) => [
      bucketKey(date, interval),
      {
        date: bucketKey(date, interval),
        label: bucketLabel(date, interval),
        commits: 0,
      },
    ]),
  );

  const commits = await prisma.commit.findMany({
    where: {
      committedAt: {
        gte: firstBucketStart,
      },
      repository: {
        ownerId: userId,
      },
    },
    select: {
      committedAt: true,
    },
  });

  for (const commit of commits) {
    const key = bucketKey(commit.committedAt, interval);
    const bucket = counts.get(key);
    if (bucket) {
      bucket.commits += 1;
    }
  }

  const series = Array.from(counts.values());
  const total = series.reduce((sum, item) => sum + item.commits, 0);
  const average = series.length === 0 ? 0 : Number((total / series.length).toFixed(2));
  const previous = series.at(-2)?.commits ?? 0;
  const latest = series.at(-1)?.commits ?? 0;

  return {
    interval,
    total,
    average,
    latest,
    trend:
      latest > previous
        ? "up"
        : latest < previous
          ? "down"
          : "flat",
    series,
  };
}

export async function getRepositoryStats(userId: string) {
  try {
    const [repoRankings, mostActiveRepo] = await Promise.all([
      prisma.repository.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          _count: {
            select: {
              commits: true,
            },
          },
          languages: true,
        },
        orderBy: {
          commits: {
            _count: "desc",
          },
        },
        take: 3,
      }),

      prisma.repository.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          _count: {
            select: {
              commits: true,
            },
          },
          languages: true,
        },
        orderBy: {
          commits: {
            _count: "desc",
          },
        },
        take: 1,
      }),
    ]);

    return {
      repoRankings,
      mostActiveRepo,
    };
  } catch (error) {
    console.log("error occured cannot get repo stats:", error);
    throw new Error("Failed to fetch repo stats");
  }
}

export async function getTopRepositories(userId: string, limit = 3) {
  return prisma.repository.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      _count: {
        select: {
          commits: true,
        },
      },
      languages: {
        orderBy: {
          bytes: "desc",
        },
      },
      stats: true,
    },
    orderBy: {
      commits: {
        _count: "desc",
      },
    },
    take: Math.min(Math.max(limit, 1), 20),
  });
}

export async function getRepositoryCommitDistribution(userId: string) {
  const repositories = await prisma.repository.findMany({
    where: { ownerId: userId },
    include: {
      _count: {
        select: {
          commits: true,
        },
      },
    },
    orderBy: {
      commits: {
        _count: "desc",
      },
    },
  });

  const totalCommits = repositories.reduce(
    (sum, repository) => sum + repository._count.commits,
    0,
  );

  return repositories.map((repository) => ({
    id: repository.id,
    name: repository.name,
    commits: repository._count.commits,
    percentage:
      totalCommits === 0
        ? 0
        : Number(((repository._count.commits / totalCommits) * 100).toFixed(2)),
  }));
}

export async function getLanguageUsageStats(userId: string) {
  const languages = await prisma.repositoryLanguage.findMany({
    where: {
      repository: {
        ownerId: userId,
      },
    },
    select: {
      name: true,
      bytes: true,
      repositoryId: true,
    },
  });

  const totals = new Map<string, { name: string; bytes: number; repositories: Set<string> }>();

  for (const language of languages) {
    const current = totals.get(language.name) ?? {
      name: language.name,
      bytes: 0,
      repositories: new Set<string>(),
    };
    current.bytes += language.bytes;
    current.repositories.add(language.repositoryId);
    totals.set(language.name, current);
  }

  const totalBytes = Array.from(totals.values()).reduce(
    (sum, language) => sum + language.bytes,
    0,
  );

  return {
    totalBytes,
    languages: Array.from(totals.values())
      .map((language) => ({
        name: language.name,
        bytes: language.bytes,
        repositories: language.repositories.size,
        percentage:
          totalBytes === 0
            ? 0
            : Number(((language.bytes / totalBytes) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.bytes - a.bytes),
  };
}

export async function getDeveloperSummary(userId: string) {
  const [commitStats, topRepositories, languageStats, dailyTimeline] =
    await Promise.all([
      getCommitsStats(userId),
      getTopRepositories(userId, 3),
      getLanguageUsageStats(userId),
      getCommitTimeline(userId, "daily", 30),
    ]);

  const activeDays = dailyTimeline.series.filter((day) => day.commits > 0).length;
  let currentStreak = 0;

  for (const day of [...dailyTimeline.series].reverse()) {
    if (day.commits === 0) {
      break;
    }
    currentStreak += 1;
  }

  const productivityScore = Math.min(
    100,
    Math.round(
      commitStats.weeklyCommits * 6 +
        activeDays * 2 +
        topRepositories.length * 4 +
        Math.min(languageStats.languages.length, 10) * 2,
    ),
  );

  return {
    productivityScore,
    currentStreak,
    activeDays,
    topRepository: topRepositories[0] ?? null,
    topLanguage: languageStats.languages[0] ?? null,
    commitStats,
  };
}
