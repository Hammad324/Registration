import { prisma } from "../db/connectDB.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // console.log(name, email, password, )
    if (!name || !email || !password || !role) {
      return res.status(406).json({
        message: "Column names should be correct, name, email, password, role.",
      });
    }

    if ([name, email, password, role].some((field) => field?.trim() === "")) {
      return res.status(406).json({
        message: "All fields are required.",
      });
    }

    const availableRoles = ["Admin", "User"]

    if (!availableRoles.includes(role)) {
        return res.status(406).json({
            message: "Role does not match.",
          });
    }

    const existedUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({
        message: "User with this name / email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        role: role,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Could not register user.",
      });
    }

    const createdUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        password: true,
        rememberToken: true,
        emailVerifiedAt: true,
      },
    });

    return res.status(200).json({
      message: "User successfully registered.",
      user: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      Error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {};
