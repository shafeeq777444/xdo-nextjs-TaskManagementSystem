import jwt from 'jsonwebtoken'


export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        },
        process.env.JWT_ACCESS_SECRET, // Ensure this key is set in your environment
        { expiresIn: "7d" }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" } // Refresh token expires in 7 days
    );
};

