import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import { createReplyValidation, createThreadValidation, idThreadValidation, threadIdValidation } from "../validation/hub-validation.js";
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

    const replies = await prismaClient.threadReply.findMany({
        take : 20,
        skip : page,
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


export default{
    createThread,
    getThreadList,
    getThread,
    createReplyThread,
    createThreadLike,
    createThreadReplyLike
}