import {prisma} from "../db/connectDB.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer", "").trim();

        if (!token) {
            res.status(401).json({
                "message": "Unauthorized access, token not found."
            })
        };

        const decodedToken = jwt.verify(token, JWT_TOKEN_SECRET);

        const user = await prisma.users.findUnique({
            where: {
                id: decodedToken?.id
            },
            omit: {
                password: true,
                rememberToken: true,
                emailVerifiedAt: true,
            }
        });

        if (!user) {
            res.status(401).json({
                "message": "User not found. Incorrect Token."
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}