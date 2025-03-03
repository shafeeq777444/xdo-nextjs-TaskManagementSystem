import express from "express";
import { registerUser, loginUser, googleCallbackController, updateProfileAndLoginController } from "../controllers/authController.js";
import passport from "passport";
import { verifyToken } from "../middlewares/verifyToken.js";
import jwt from 'jsonwebtoken'

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallbackController);
router.post("/updateProfileAndLogin",verifyToken, updateProfileAndLoginController)

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", (req, res) => {
    console.log("logout");
    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None", path: "/" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None", path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
});

router.get("/me", (req, res) => {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken)

    if (!accessToken) {
        return res.status(401).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        console.log(decoded)
        res.json({ isAuthenticated: true, user: decoded });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ isAuthenticated: false });
    }
});

export default router;
