import {prisma} from "@/src/server/prisma/client"


export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getUserByGithubId(githubId: string) {
  return prisma.user.findUnique({
    where: {
      githubId,
    },
  });
}

export async function updateGithubData(
  userId: string,
  data : {
  usrname?: string;
  avatarUrl? : string;
  }
) {
  return prisma.user.update({
    where : {id: userId},
    data,
  });
}