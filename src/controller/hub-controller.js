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

const createTierlistC = async(req,res,next) => {
    try {
        const userId = req.user.id;
        const image = req.file.filename;
        const request = {
            content : req.body.content
        };

        const result = await hubService.createTierlist(request, userId, image);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const getTierlistAllC = async(req,res,next) => {
    try {
        const request = {};
        request.page = req.query.page || 1;
        request.size = req.query.size || 20;

        const result = await hubService.getTierlistAll(request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }    
} 

const getTierlistC = async (req,res,next) => {
    try {
        const id_tierlist = req.params.id_tierlist;
        const page = req.query.page || 1;
        const userId = req.user.id;
        const result = await hubService.getTierList(id_tierlist, page, userId);

        res.status(200).json({
            data : result
        });
    } catch (e) {   
        next(e);
    }
}

const createReplyTierlistC = async (req,res,next) => {
    try {
        const id_tierlist = req.params.id_tierlist;
        const userId = req.user.id;

        const result = await hubService.createReplyTierlist(req.body, id_tierlist, userId);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);        
    }
}

const voteTierlistC = async(req,res,next) => {
    try {
        const id_user = req.user.id;
        const request = req.body;
        request.id_tierlist = req.params.id_tierlist;

        const result = await hubService.voteTierlist(request, id_user);

        res.status(200).json({
            data : "OK"
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
    createThreadReplyLikeC,
    createTierlistC,
    getTierlistAllC,
    getTierlistC,
    createReplyTierlistC,
    voteTierlistC
}