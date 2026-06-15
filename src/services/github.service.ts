import { Octokit } from "octokit";

export function getGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

export async function getUserProfile(token: string) {
  const octokit = getGitHubClient(token);

  const { data } = await octokit.rest.users.getAuthenticated();

  return data;
}

export async function getRepositories(token : string){
  const octokit = getGitHubClient(token);

  const {data} = 
  await octokit.rest.repos.listForAuthenticatedUser({
    sort : "updated",
    per_page : 100
  });
  
  return data;
}

export async function getRecentCommits(token: string, owner: string, repo: string, perPage = 100) {
  const octokit = getGitHubClient(token);

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
  });

  return data;
}

export async function getRepositoryLanguages(token: string, owner: string, repo: string) {
  const octokit = getGitHubClient(token);

  const { data } = await octokit.rest.repos.listLanguages({
    owner,
    repo,
  });

  return data;
}