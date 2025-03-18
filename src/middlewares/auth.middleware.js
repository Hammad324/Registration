import {prisma} from "../db/connectDB.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer", "").trim();

        if (!token) {
            return res.status(401).json({
                "message": "Unauthorized access, token not found. Login Please.",
                "status": "Error"
            })
        };

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        
        const user = await prisma.users.findUnique({
            where: {
                id: decodedToken.id
            },
            omit: {
                password: true,
                rememberToken: true,
                emailVerifiedAt: true,
            }
        });
        if (!user) {
            return res.status(401).json({
                "message": "User not found. Invalid Token.",
                "status": "Error"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(400).json({
            "Error from middleware catch block": error.message,
            "status": "Error"  
        })
    }
}