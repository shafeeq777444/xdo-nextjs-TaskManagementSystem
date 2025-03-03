import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {

    const token = req.cookies?.accessToken;
    // console.log(token, 'token from fsdfs');
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // console.log("Decoded JWT payload:", decoded); 
        req.user = decoded; // Add user info to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

