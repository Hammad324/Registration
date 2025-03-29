import { prisma } from "../db/connectDB.js";
import { isTokenBlacklisted } from "../utils/handleBlacklistedTokens.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token =
            req.cookies?.token || authHeader?.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token not found. Please log in.",
                status: "Error",
            });
        }

        const isBlacklisted = await isTokenBlacklisted(token);

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Session expired or token invalidated",
                status: "Error",
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        const user = await prisma.users.findUnique({
            where: {
                id: decodedToken.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        if (!user || user.status !== 1) {
            return res.status(403).json({
                message: "Access denied. User not found or deactivated.",
                status: "Error",
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.log("auth middleware", error.message);
        return res.status(500).json({
            message: "Invalid or expired token",
            status: "Error",
            "Error from middleware catch block": error.message,
        });
    }
};
