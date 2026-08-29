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

        const result = await hubService.getThreadList(request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getThreadC = async(req,res,next) => {
    try {
        const pageReplies = Number(req.query.page);
        const id_thread = req.params.id_thread;

        const result = await hubService.getThread(id_thread, pageReplies);
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

export default{
    createThreadC,
    getThreadListC,
    getThreadC,
    createReplyThreadC
}