import jwt from "jsonwebtoken";
import { prisma } from "../db/connectDB.js";

export const generateToken = async (user) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
      }
    );
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        rememberToken: token,
      },
    });
    return token;
  } catch (error) {
    // return res.status(500).json({
    //     "message": "Server is generated due to generateToken function.",
    //     "Error": error.message
    // })
    console.log(error.message);
  }
};
