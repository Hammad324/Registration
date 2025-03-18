// inputs dummy data in the database along with the migratin command or use.
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/handlePassword.js";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.users.create({
        data: {
            name: "test",
            email: "test@gamil.com",
            password: await hashPassword("pass123"),
            role: "Admin",
            status: 1,
        }
    });
    console.log(`Database has been seeded.`);
};

main()
.catch((error) => {
    console.log(`Error seeding the database: ${error.message}`);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})