
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import CustomError from "../middlewares/customError.js";
import { generateAccessToken, generateRefreshToken } from "../middlewares/generateToken.js";

// googleCallBack--------------------------------------------------------
export const googleCallBackService = async (googleUser) => {
    console.log(googleUser)
    let user = await User.findOne({ email: googleUser.emails[0].value })

    if (!user) {
        user = new User({
            name: googleUser.name.givenName,
            email: googleUser.emails[0].value,
            provider: googleUser.provider,
            avatar: googleUser.photos[0].value,
            profileCompleted: false, // User needs to complete extra credentials
        });
        await user.save();
    }
    if (user.isDeleted) {
        throw new CustomError("Your account is deleted. Contact support.", 403);
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { profileCompleted: user.profileCompleted, accessToken, refreshToken }
}

export const updateProfileAndLoginService = async (password,email) => {
  let user = await User.findOne({ email });

  if (!user) {
      throw new CustomError("User not found", 404);
  }

  if (user.isActive) {
      throw new CustomError("Your account is deleted. Contact support.", 403);
  }


  if (!password ) {
      throw new CustomError("Password  are required", 400);
  }

  // Hash the password before saving
 
  user.password = password
  user.profileCompleted = true; // Mark profile as completed

  await user.save();

// Generate access and refresh tokens
const accessToken = await generateAccessToken(user);
const refreshToken = await generateRefreshToken(user);

return {accessToken,refreshToken,user}
}

/**
 * Register User
 */
export const registerUserService = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new CustomError("User already exists", 400);
  const user = await User.create({ name, email, password,profileCompleted:true });
    return user
};

/**
 * Login User
 */
export const loginUserService = async ({ email, password }) => {

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid credentials", 401);
  }
  const accessToken =await generateAccessToken(user);
  const refreshToken =await generateRefreshToken(user);
  return {accessToken,refreshToken}
};
