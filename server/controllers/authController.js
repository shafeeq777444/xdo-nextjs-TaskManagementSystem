import asyncHandler from "../middlewares/asyncHandler.js";
import { googleCallBackService, loginUserService, registerUserService, updateProfileAndLoginService } from "../services/authService.js";


// googleCallBack--------------------------------------------------------
export const googleCallbackController = asyncHandler(async (req, res) => {
  if (!req.user) {
      throw new CustomError("User data not founded from google Oauth", 401);
  }



  const { profileCompleted, refreshToken, accessToken } = await googleCallBackService(req.user);
  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: "/",
  });
  res.cookie("accessToken", accessToken, {
      httpOnly: true, 
      secure: true,
      // maxAge: 15 * 60 * 1000, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      path: "/",
  });
  if (!profileCompleted) {
      res.redirect("http://localhost:3000/userCredentials");
  }
  res.redirect("http://localhost:3000/dashboard");




});

// update Profile (profileCompleted:true)--------------------------------------------
export const updateProfileAndLoginController = asyncHandler(async (req, res) => {
  const { refreshToken, accessToken, user } = await updateProfileAndLoginService(req.body.password,req.user.email);
  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      // maxAge: 15 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      path: "/",
  });
  res.json({ profileCompleted: user.profileCompleted })
});


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userData = await registerUserService({ name, email, password });
  res.status(201).json({userEmail:userData.email,
    message:"Registeration Completed"
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const {accessToken,refreshToken} = await loginUserService({ email, password });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: '/',
    maxAge:7*24*60*60*1000
});
res.cookie("accessToken", accessToken, {
    httpOnly: true, 
    secure: true,
    maxAge: 1*24*60*60*1000, 
    sameSite: "none", 
    path: '/'
});
  res.status(200).json({accessToken,refreshToken})

});
