import { prisma } from "../db/connectDB.js";

export const checkUserStatus = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma.users.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        if (user.status !== 1) {
            return res.status(403).json({
                message: "User not available. Please contact support.",
                status: "Error",
            });
        }

        next();
    } catch (error) {
        console.log(`Error from status middleware: ${error.message}`);
        return res.status(500).json({
            message: "Error verifying user.",
            status: "Error",
        });
    }
};
