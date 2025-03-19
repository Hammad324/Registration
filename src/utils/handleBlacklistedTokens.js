import { prisma } from "../db/connectDB.js"

// blacklist a token
export const blacklistToken = async (token) => {
    await prisma.blacklistedTokens.create({
        data: {
            token
        }
    });
}

// check the blacklisted token
export const isTokenBlacklisted = async (token) => {
    const tokenIsBlacklisted = await prisma.blacklistedTokens.findUnique({
        where: {
            token
        }
    });

    return Boolean(tokenIsBlacklisted);
}