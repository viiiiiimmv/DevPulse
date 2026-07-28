import { Octokit } from "octokit";
import { cached } from "@/src/services/cache.service";

export function getGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

function tokenCacheKey(token: string) {
  return token.slice(-12);
}

function getGitHubErrorMessage(error: unknown, context: string) {
  const candidate = error as {
    status?: number;
    message?: string;
    response?: {
      headers?: Record<string, string | number | undefined>;
    };
  };
  const headers = candidate.response?.headers ?? {};
  const remaining = headers["x-ratelimit-remaining"];
  const reset = headers["x-ratelimit-reset"];

  if (candidate.status === 403 && String(remaining) === "0") {
    const resetDate =
      reset === undefined
        ? null
        : new Date(Number(reset) * 1000);

    return resetDate && !Number.isNaN(resetDate.getTime())
      ? `GitHub API rate limit reached while ${context}. Try again after ${resetDate.toLocaleString()}.`
      : `GitHub API rate limit reached while ${context}. Try again later.`;
  }

  if (candidate.status) {
    return `GitHub API error while ${context}: ${candidate.status} ${candidate.message ?? ""}`.trim();
  }

  return `GitHub API request failed while ${context}: ${
    error instanceof Error ? error.message : "Unknown error"
  }`;
}

async function withGitHubErrors<T>(context: string, action: () => Promise<T>) {
  try {
    return await action();
  } catch (error) {
    throw new Error(getGitHubErrorMessage(error, context));
  }
}

export async function getUserProfile(token: string) {
  return cached(`github:profile:${tokenCacheKey(token)}`, 5 * 60 * 1000, async () => {
    const octokit = getGitHubClient(token);

    const { data } = await withGitHubErrors("fetching user profile", () =>
      octokit.rest.users.getAuthenticated(),
    );

    return data;
  });
}

export async function getRepositories(token : string){
  return cached(`github:repos:${tokenCacheKey(token)}`, 5 * 60 * 1000, async () => {
    const octokit = getGitHubClient(token);

    const {data} =
    await withGitHubErrors("fetching repositories", () =>
      octokit.rest.repos.listForAuthenticatedUser({
        sort : "updated",
        per_page : 100
      }),
    );

    return data;
  });
}

export async function getRecentCommits(token: string, owner: string, repo: string, perPage = 100) {
  return cached(
    `github:commits:${tokenCacheKey(token)}:${owner}/${repo}:${perPage}`,
    2 * 60 * 1000,
    async () => {
      const octokit = getGitHubClient(token);

      const { data } = await withGitHubErrors(`fetching commits for ${owner}/${repo}`, () =>
        octokit.rest.repos.listCommits({
          owner,
          repo,
          per_page: perPage,
        }),
      );

      return data;
    },
  );
}

export async function getRepositoryLanguages(token: string, owner: string, repo: string) {
  return cached(
    `github:languages:${tokenCacheKey(token)}:${owner}/${repo}`,
    30 * 60 * 1000,
    async () => {
      const octokit = getGitHubClient(token);

      const { data } = await withGitHubErrors(`fetching languages for ${owner}/${repo}`, () =>
        octokit.rest.repos.listLanguages({
          owner,
          repo,
        }),
      );

      return data;
    },
  );
}
