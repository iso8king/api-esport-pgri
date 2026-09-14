import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import { createCommentTierlistValidation, createReplyValidation, createThreadValidation, createTierlistValidation, deleteReplyThreadValidation, deleteReplyTierlistValidation, deleteThreadValidation, deleteTierlistValidation, idThreadValidation, threadIdValidation, updateCommentTierlistValidation, updateReplyThreadValidation, updateThreadValidation, updateTierlistValidation, voteTierlistValidation } from "../validation/hub-validation.js";
import { transformDocument } from "@prisma/client/runtime/index.js";

const createThread = async(id_user,request) => {
    request = validate(createThreadValidation, request);

    return prismaClient.thread.create({
        data : {
            authorId : id_user,
            content : request.content,
            title : request.title,
            pinned : request.pinned, 
        }
    })
}

const getThreadList = async(request, id_user) => {
    const skip = (request.page - 1) * request.size;
    const size = request.size;

    const threads = await prismaClient.thread.findMany({
        skip,
        take : size,
        orderBy : {
            createdAt : "desc"
        },
        select : {
            id : true,
            title : true, 
            content : true,
            createdAt : true,
            pinned : true,
            author : {
                select : {
                    id : true,
                    nama : true,
                    pfp : true
                }
            },
            _count : {
                select : {
                    likes : true,
                    replies : true
                }
            },
            likes : {
                where : {
                    userId : id_user
                }, select : {id : true},
                take : 1
            }
        }
    });

    const total = await prismaClient.thread.count();
    if(total < 1) throw new responseError(404, "Belum Ada Threads Yang di Post.");

    return {
        paging: {
            page: request.page,
            totalItems: total,
            totalPage: Math.ceil(total / request.size)
        }, data : threads
    }
}

const getThread = async(id_thread, page, id_user) => {
    id_thread = validate(idThreadValidation, id_thread);

    const thread = await prismaClient.thread.findUnique({
        where : {
            id : id_thread
        },
        select : {
            id : true,
            title : true,
            content : true,
            author : {
                select : {
                    id : true,
                    nama : true,
                    pfp : true
                }
            }, _count : {
                select : {
                    likes : true,
                    replies : true
                }
            }, createdAt : true,
            updatedAt : true,
            likes : {
                where : { userId : id_user},
                select : {id : true},
                take: 1
            }
        }
    });

    if(!thread) throw new responseError(404, "Thread Not Found!");

    const skip = (page-1)*20;

    const replies = await prismaClient.threadReply.findMany({
        take : 20,
        skip : skip,
        where : {
            threadId : id_thread
        }, select : {
            id : true,
            content : true,
            author : {
                select : {
                    id : true,
                    nama : true,
                    pfp : true
                }
            },createdAt : true,
            likes : {
                where : {userId : id_user},
                select : {id : true},
                take : 1
            },
            _count : {
                select : {
                    likes : true
                }
            }
        }
    });

    return  {
        thread, replies,
        pagingReplies : {
            page: page,
            totalItems: replies.length,
            totalPage: Math.ceil(replies.length / 20)
        }
    }
}

const createReplyThread = async(request, id_author) => {
    request = validate(createReplyValidation, request);

    const thread = await prismaClient.thread.count({
        where : {
            id : request.threadId
        }
    });

    if(thread < 1) throw new responseError(404, 'Thread Tidak Ditemukan!');

    return prismaClient.threadReply.create({
        data : {
            content : request.content,
            authorId : id_author,
            threadId : request.threadId
        }
    });
}

const createThreadLike = async(thread_id, user_id) => {
    thread_id = validate(threadIdValidation, thread_id);

    const thread = await prismaClient.thread.count({
        where : {
            id : thread_id
        }
    });

    if(!thread) throw new responseError(404, "Thread Not Found!");

    return prismaClient.threadLike.create({
        data : {
            threadId : thread_id,
            userId : user_id
        }
    });
}

const createThreadReplyLike = async(threadId, userId, replyId) =>{
    console.log({
        threadId, replyId, userId
    })
    threadId = validate(threadIdValidation, threadId);
    replyId = Number(replyId);

    const thread = await prismaClient.thread.count({
        where : {
            id : threadId
        }
    });

    if(!thread) throw new responseError(404, "Thread Not Found!");

    const reply = await prismaClient.threadReply.count({
        where : {
            id : replyId
        }
    });

    if(!reply) throw new responseError(404, "Thread Reply Not Found!");

    return prismaClient.replyLike.create({
        data : {
            reply: { connect: { id: replyId } },
            user: { connect: { id: userId } }
        }
    });
}

const createTierlist = async(request, id_user, image) => {
    request = validate(createTierlistValidation, request);

    return prismaClient.tierlist.create({
        data : {
            authorId : id_user,
            image,
            content : request.content
        }
    })
} 

const getTierlistAll = async (request, id_user) => {
    const skip = (request.page - 1) * request.size;
    const size = request.size;

    const tierlist = await prismaClient.tierlist.findMany({
        skip,
        take: size,
        select: {
            id: true,
            content: true,
            createdAt: true,
            image: true,
            user: {
                select: {
                    nama: true,
                    pfp: true,
                    id: true
                }
            },
            _count: {
                select: {
                    replies: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const total = await prismaClient.tierlist.count();
    if (!total) throw new responseError(404, "Jadilah Yang Pertama, Post Tier List Kamu Disini.");

    const tierlistIds = tierlist.map((t) => t.id);

    const myVotes = await prismaClient.tierlistLike.findMany({
        where: {
            userId: id_user,
            tierlistId: { in: tierlistIds }
        },
        select: {
            tierlistId: true,
            value: true
        }
    });
    const myVoteMap = new Map(myVotes.map((v) => [v.tierlistId, v.value]));

    const data = await Promise.all(
        tierlist.map(async (item) => {
            const vote = await prismaClient.tierlistLike.aggregate({
                where: { tierlistId: item.id },
                _sum: { value: true }
            });

            return {
                ...item,
                likeCount: vote._sum.value ?? 0,
                myVote: myVoteMap.get(item.id) ?? 0
            };
        })
    );

    return {
        paging: {
            page: request.page,
            totalItems: total,
            totalPage: Math.ceil(total / request.size)
        },
        data
    };
};

const getTierList = async (id_tierlist, page, id_user) => {
    id_tierlist = Number(id_tierlist);

    const tier_list = await prismaClient.tierlist.findUnique({
        where: {
            id: id_tierlist
        },
        select: {
            id: true,
            image: true,
            content: true,
            createdAt: true,
            user: {
                select: {
                    nama: true,
                    id: true,
                    pfp: true
                }
            },
            _count: {
                select: {
                    replies: true,
                }
            },
            likes: {
                where: { userId: id_user },
                take: 1
            }
        }
    });

    if (!tier_list) throw new responseError(404, "Tierlist Not Found!");

    const take = 20;
    const skip = (page - 1) * take;

    const tierlistReply = await prismaClient.tierlistReply.findMany({
        where: { tierlistId: id_tierlist },
        take,
        select: {
            id: true,
            user: {
                select: {
                    nama: true,
                    id: true,
                    pfp: true
                }
            },
            content: true,
            createdAt: true,
        }
    });

    const likeCount = await prismaClient.tierlistLike.aggregate({
        where: {
            tierlistId: tier_list.id
        },
        _sum: {
            value: true
        }
    });

    const myVote = tier_list.likes[0]?.value ?? 0;

    const { likes, ...tierListWithoutRawLikes } = tier_list;

    const data = {
        ...tierListWithoutRawLikes,
        likeCount: likeCount._sum.value ?? 0,
        myVote
    };

    const totalItems = tier_list._count.replies;

    return {
        tier_list: data,
        tierlistReply,
        pagingReplies: {
            page: page,
            totalItems,
            totalPage: Math.ceil(totalItems / take)
        }
    };
};

const createReplyTierlist = async(request, id_tierlist, id_user) => {
    request = validate(createCommentTierlistValidation, request);
    id_tierlist = Number(id_tierlist);

    const tierlist = await prismaClient.tierlist.count({
        where : {
            id : id_tierlist
        }
    });

    if(!tierlist) throw new responseError(404, "Tierlist Not Found!");

    const createReply = await prismaClient.tierlistReply.create({
        data : {
            content : request.content,
            user : {
                connect : {
                    id : id_user
                }
            },
            tierlist : {
                connect : {
                    id : id_tierlist
                }
            }
        },
        select : {
            content : true,
            id : true,
            createdAt : true,
            user : {
                select : {
                    nama : true,
                    id: true,
                    pfp : true
                }
            }
        }
    });

    return createReply;

}

const voteTierlist = async (request, id_user) => {
    request = validate(voteTierlistValidation, request);

    const tierlist = await prismaClient.tierlist.count({
        where: {
            id: request.id_tierlist
        }
    });

    if (!tierlist) throw new responseError(404, "Tierlist Not Found!");

    const existingVote = await prismaClient.tierlistLike.findUnique({
        where: {
            userId_tierlistId: {
                userId: id_user,
                tierlistId: request.id_tierlist
            }
        }
    });

    let myVote;

    if (!existingVote) {
        await prismaClient.tierlistLike.create({
            data: {
                tierlist: {
                    connect: { id: request.id_tierlist }
                },
                user: {
                    connect: { id: id_user }
                },
                value: request.value
            }
        });
        myVote = request.value;
    } else if (existingVote.value === request.value) {
        await prismaClient.tierlistLike.delete({
            where: { id: existingVote.id }
        });
        myVote = 0;
    } else {
        await prismaClient.tierlistLike.update({
            where: { id: existingVote.id },
            data: { value: request.value }
        });
        myVote = request.value;
    }

    const aggregate = await prismaClient.tierlistLike.aggregate({
        where: { tierlistId: request.id_tierlist },
        _sum: { value: true }
    });

    return {
        likeCount: aggregate._sum.value ?? 0,
        myVote
    };
};

const updateOperationInHub = async(request, service) => {
    let result = {};
    switch (service) {
        case "thread":
            request = validate(updateThreadValidation, request);

            const thread = await prismaClient.thread.findFirst({
                where : {
                    AND : [
                        {id : request.id},
                        {authorId : request.authorId}
                    ]
                }
            });

            if(!thread) throw new responseError(404, "Tidak Ditemukan");

            const field = ["title", "content", "pinned"];
            const data = {}

            for (const f of field) {
                if(request[f] !== undefined) data[f] = request[f]
            }
            
            result = await prismaClient.thread.update({
                where : {
                    id : request.id
                }, data
            })
            
            break;
        
        case "replyThread":
            request = validate(updateReplyThreadValidation, request);

            const replyThread = await prismaClient.threadReply.findFirst({
                where : {
                    AND : [
                        {id : request.id},
                        {authorId : request.authorId},
                        {threadId : request.threadId}
                    ]
                }
            });

            if(!replyThread) throw new responseError(404, "Thread Reply Not Found!");

            result = await prismaClient.threadReply.update({
                where : {
                    id : request.id
                }, data : {
                    content : request.content
                }
            });
            break;

        case "tierlist" :
            request = validate(updateTierlistValidation, request);

            const tierlist = await prismaClient.tierlist.findFirst({
                where : {
                    AND : [
                        {authorId : request.authorId},
                        {id : request.id}
                    ]
                }
            });

            if(!tierlist) throw new responseError(404, "Tierlist Not Found!");

            result = await prismaClient.tierlist.update({
                where : {
                    id : request.id
                }, data : {
                    content : request.content
                }    
            })
            break;

        case "replyTierlist" : 
            request = validate(updateCommentTierlistValidation, request);
            const reply = await prismaClient.tierlistReply.findFirst({
                where : {
                    AND : [
                        {id : request.id},
                        {tierlistId : request.tierlistId},
                        {userId : request.authorId}
                    ]
                }
            });

            if(!reply) throw new responseError(404, "Reply Tierlist not found!");

            result = await prismaClient.tierlistReply.update({
                where : {
                    id : request.id
                },
                data : {
                    content : request.content
                }
            })
            break;
            
    
        default:
            throw new responseError(400, "Tulis Query service di url!");
        
    }
    return result;
}

const deleteOperationInHub = async (request, service) => {
    let result = {};

    switch (service) {

        case "thread":
            request = validate(deleteThreadValidation, request);

            const thread = await prismaClient.thread.findFirst({
                where: {
                    AND: [
                        { id: request.id },
                        { authorId: request.authorId }
                    ]
                }
            });

            if (!thread) {
                throw new responseError(404, "Thread Not Found!");
            }

            result = await prismaClient.thread.delete({
                where: {
                    id: request.id
                }
            });

            break;


        case "replyThread":
            request = validate(deleteReplyThreadValidation, request);

            const replyThread = await prismaClient.threadReply.findFirst({
                where: {
                    AND: [
                        { id: request.id },
                        { authorId: request.authorId },
                        { threadId: request.threadId }
                    ]
                }
            });

            if (!replyThread) {
                throw new responseError(404, "Thread Reply Not Found!");
            }

            result = await prismaClient.threadReply.delete({
                where: {
                    id: request.id
                }
            });

            break;


        case "tierlist":
            request = validate(deleteTierlistValidation, request);

            const tierlist = await prismaClient.tierlist.findFirst({
                where: {
                    AND: [
                        { id: request.id },
                        { authorId: request.authorId }
                    ]
                }
            });

            if (!tierlist) {
                throw new responseError(404, "Tierlist Not Found!");
            }

            result = await prismaClient.tierlist.delete({
                where: {
                    id: request.id
                }
            });

            break;


        case "replyTierlist":
            request = validate(deleteReplyTierlistValidation, request);

            const replyTierlist = await prismaClient.tierlistReply.findFirst({
                where: {
                    AND: [
                        { id: request.id },
                        { tierlistId: request.tierlistId },
                        { userId: request.authorId }
                    ]
                }
            });

            if (!replyTierlist) {
                throw new responseError(
                    404,
                    "Reply Tierlist Not Found!"
                );
            }

            result = await prismaClient.tierlistReply.delete({
                where: {
                    id: request.id
                }
            });

            break;


        default:
            throw new responseError(
                400,
                "Tulis Query service di url!"
            );
    }

    return result;
};


export default{
    createThread,
    getThreadList,
    getThread,
    createReplyThread,
    createThreadLike,
    createThreadReplyLike,
    createTierlist,
    getTierlistAll,
    getTierList,
    createReplyTierlist,
    voteTierlist,
    updateOperationInHub,
    deleteOperationInHub
}