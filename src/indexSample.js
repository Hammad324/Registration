import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
    // for a single entry
    // const user = await prisma.user.create({
    //     data: {
    //         name: "Hammad",
    //         email: "hammad@gamil.com"
    //     }
    // })

    // multiple entries
    // const user = await prisma.user.createMany({
    //     data: [
    //         {name: "Alice", email: "alice@gamil.com"},
    //         {name: "Bob", email: "bob@gamil.com"}]
    // })

    // filtering
    // const user = await prisma.user.findFirst({
    //     where:{
    //         name: "Hammad"
    //     }
    // })

    // update
    // const user = await prisma.user.update({
    //     // unique element where clause should be provided.
    //     where:{
    //         id: 1
    //     }, // unique field
    //     data: {
    //         email :"Hammad Farrukh Rohilla"
    //     }
    // })
    // const user = await prisma.user.updateMany({
    //     where:{
    //         name: "Alice"
    //     },
    //     data: {
    //         email :"alice23@gamil.com"
    //     }
    // })

    // delete user
    const user = await prisma.user.delete({
        where: { id: 3 },
    });
    console.log(user);
};

connectDB()
    .catch((e) => console.log(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

// prisma generate -> Updates prisma client so you can use the latest schema in your application.
