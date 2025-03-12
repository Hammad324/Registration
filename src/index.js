import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB, prisma } from "./db/connectDB.js";

dotenv.config({path: "./.env"})

connectDB()
.then(() => {
    console.log(`MySQL connected.`)
})
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch(async (error) => {
    console.log(`Error Found: ${error.message}`)
    await prisma.$disconnect()
})


