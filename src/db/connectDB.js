import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        throw Error(`message:${error.message}`)
    }
}