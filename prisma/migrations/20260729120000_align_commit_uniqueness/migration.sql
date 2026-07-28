DROP INDEX IF EXISTS "Commit_sha_key";

CREATE UNIQUE INDEX IF NOT EXISTS "Commit_repositoryId_sha_key" ON "Commit"("repositoryId", "sha");

DROP INDEX IF EXISTS "Repository_githubRepoId_key";

CREATE UNIQUE INDEX IF NOT EXISTS "Repository_ownerId_githubRepoId_key" ON "Repository"("ownerId", "githubRepoId");
