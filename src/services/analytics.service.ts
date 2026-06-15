import {prisma} from "@/src/server/prisma/client"

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const startOfTomorrow = new Date(startOfToday);
startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

export async function getCommitsStats(userId : string) {
    try {
        const [
            totalCommits,
            monthlycommits,
            weeklyCommits,
            dailyCommits,
        ] = await Promise.all([
            prisma.commit.count({
                where:{
                    repository:{
                        ownerId : userId
                    }
                }
            }),

            prisma.commit.count({
                where:{
                    committedAt:{
                        gte : thirtyDaysAgo
                    },
                    repository:{
                        ownerId : userId
                    }
                }
            }),
            
            prisma.commit.count({
                where : {
                    committedAt:{
                        gte: sevenDaysAgo
                    },
                    repository:{
                        ownerId : userId
                    }
                }
            }),
            
            prisma.commit.count({
                where : {
                    committedAt :{
                        gte: startOfToday,
                        lt : startOfTomorrow,
                    },

                    repository :{
                        ownerId : userId
                    }
                }
            })

        ]);

        return {
            totalCommits,
            monthlycommits,
            weeklyCommits,
            dailyCommits
        };
    } catch (error) {
        console.error("failed to fetch commits data : ", error);
        throw new Error("Failed to fetch commits data");
    }
}

export async function getRepositoryStats(userId: string){
    try{
        const [
            repoRankings,
            mostActiveRepo,
        ] = await Promise.all([
            prisma.repository.findMany({
                where : {
                    ownerId : userId,
                },
                include:{
                    _count:{
                        select : {
                            commits : true,
                        },
                    },
                    languages: true,
                },
                orderBy :{
                    commits :{
                        _count : "desc",
                    },
                },
                take:3,
            }),

            prisma.repository.findMany({
                where : {
                    ownerId : userId,
                },
                include:{
                    _count:{
                        select : {
                            commits : true,
                        },
                    },
                    languages: true,
                },
                orderBy :{
                    commits :{
                        _count : "desc",
                    },
                },
                take:1
            }),
        ]);

        return {
            repoRankings,
            mostActiveRepo,
        };
    } catch(error){
        console.log("error occured cannot get repo stats:",error)
        throw new Error("Failed to fetch repo stats");
    }
    
}