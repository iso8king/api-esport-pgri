import userService from "../service/user-service.js";

const register = async(req, res, next)=>{
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e);
    }
}

const login = async(req,res,next)=>{
    try {
        const result = await userService.login(req.body);
        res.cookie('accessToken', result.token_access, {
             httpOnly: true,
             secure: false, // false untuk localhost
             sameSite: 'lax',
             maxAge:  60 * 60 * 1000, // 7 hari
            path: '/'
        });


        res.status(200).json({
        data: result,
        });
        
    } catch (e) {
        next(e);        
    }
}

const logout = (req,res,next)=>{
    try {
    res.clearCookie("accessToken", {path : '/'});
    res.clearCookie("refreshToken", {path : '/'});

    res.status(200).json({
        data : 'OK',
    });
        
    } catch (e) {
        next(e);
    }
}

const updateProfile = async(req,res,next)=>{
    try {
    const result = await userService.updateProfile(req.user.id, req.body);
    res.clearCookie("accessToken", {path : '/'});
    res.clearCookie("refreshToken", {path : '/'});

    res.status(200).json({
        data: result
    })
        
    } catch (e) {
        next(e);        
    }
}

const getUser = (req,res,next)=>{
    try {
        res.status(200).json({
            data : req.user
        })
    } catch (e) {
        next(e);        
    }
}

const verifyOTP = async(req,res,next)=>{
    try {
    const request = req.body;
    request.email = req.user.email;
    console.log(request)
    const result = await userService.verifyOTP(request);
    res.status(200).json({
      data: result
    });
    } catch (e) {
        next(e)        
    }
}

export default{
    register,
    login,
    logout,
    updateProfile,
    getUser,
    verifyOTP
}