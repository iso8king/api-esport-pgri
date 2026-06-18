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
             secure: false,
             sameSite: 'lax',
             maxAge:  60 * 60 * 1000, 
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

const requestotp = async(req,res,next)=>{
    try {
        const result = await userService.requestOTP(req.user.email);
        res.status(200).json({
            data : "OK"
        })
    } catch (e) {
        next(e)        
    }
}

const changePassword = async(req,res,next)=>{
    try {
        const result = await userService.changePW(req.body, req.user.id);
        res.status(200).json({
            data : 'OK'
        });
    } catch (e) {
        next(e);        
    }
}

const checkPassword = async(req,res,next)=>{
    try {
        await userService.checkPassword(req.body.password, req.user.id);
        res.status(200).json({
            data : 'OK'
        });
    } catch (e) {
        next(e);
    }
}

const sendOTPForgetPassword = async(req,res,next) => {
    try {
        const request = req.body;
        const result = await userService.otpForgetPassword(request);

        res.status(200).json({
            data : 'OK'
        });
    } catch (e) {  
        next(e);
    }
}

const verifyOTPForgetPassword = async(req,res,next)=>{
    try {
    const request = req.body;
    console.log(request)
    const result = await userService.verifyOTPChangePassword(request);
     res.cookie('forgetPasswordToken', result, {
             httpOnly: true,
             secure: false,
             sameSite: 'lax',
             maxAge:  60 * 60 * 1000, 
            path: '/'
        });

    res.status(200).json({
      data: "Akun Berhasil di Verifikasi"
    });
    } catch (e) {
        next(e)        
    }
}

const changePasswordFromForgetPassword = async(req,res,next)=>{
    try {
        const request = req.body;
        const cookie = req.cookies.forgetPasswordToken;
        const result = await userService.changePasswordFromForgetPassword(cookie, request);
        res.clearCookie("forgetPasswordToken", {path : '/'});
        res.status(200).json({
            data : "Success!"
        })
    } catch (e) {
        next(e);        
    }
}

export default{
    register,
    login,
    logout,
    updateProfile,
    getUser,
    verifyOTP,
    requestotp,
    changePassword,
    checkPassword,
    sendOTPForgetPassword,
    verifyOTPForgetPassword,
    changePasswordFromForgetPassword
}