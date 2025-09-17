import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const protect = async (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({messagae: "No token, access denied"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decode.id).select("-password");
        console.log(user); // it gives the user object


        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        req.userId = user._id;
        next();
    }catch(err){
        res.status(401).json({message: "Token invalid or expired."});
    }
};

// Role guard: allow only specified roles
export const authorizeRoles = (...allowed) => {
  return (req, res, next) => {
    if (!req.user?.role || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};