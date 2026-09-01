import hubService from "../service/hub-service.js";

const createThreadC = async(req,res,next) => {
    try {
        const request = req.body;
        const id_user = req.user.id;

        const result = await hubService.createThread(id_user, request);
        res.status(200).json({
            data : result
        });
    } catch (e) {
        next(e);        
    }
}

const getThreadListC = async(req,res,next) => {
    try {
        const request = {};
        request.size = req.query.size || 10;
        request.page = req.query.page || 1;
        const id_user = req.user.id;

        const result = await hubService.getThreadList(request, id_user);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getThreadC = async(req,res,next) => {
    try {
        const pageReplies = Number(req.query.page) || 1;
        const id_thread = req.params.id_thread;
        const id_user = req.user.id;

        const result = await hubService.getThread(id_thread, pageReplies, id_user);
        res.status(200).json({
            data : result
        })
    } catch(e) {
        next(e);
    }
}

const createReplyThreadC = async(req,res,next) => {
    try {
        const id_user = req.user.id;
        const request = req.body;
        request.threadId = req.params.id_thread;

        const result = await hubService.createReplyThread(request, id_user);
        res.status(200).json({
            data : result
        });
    } catch (e) {
        next(e);        
    }
}

const createThreadLikeC = async(req,res,next) => {
    try {
        const id_user = req.user.id;
        const thread_id = req.params.id_thread;

        const result = await hubService.createThreadLike(thread_id, id_user);
        res.status(200).json({
            data : 'OK'
        })
    } catch (e) {
        next(e);        
    }
}

const createThreadReplyLikeC = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const thread_id = req.params.id_thread;
        const reply_id = req.params.id_reply;

        const result = await hubService.createThreadReplyLike(thread_id, userId, reply_id);
        res.status(200).json({
            data : 'OK'
        })
    } catch (e) {
        next(e);        
    }
}

export default{
    createThreadC,
    getThreadListC,
    getThreadC,
    createReplyThreadC,
    createThreadLikeC,
    createThreadReplyLikeC
}