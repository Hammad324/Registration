import { prisma } from "../db/connectDB.js";
import argon2 from "argon2";
import { generateToken } from "../utils/generateJWTtoken.js";
import { comparePasswordHash, hashPassword } from "../utils/handlePassword.js";

export const registerUser = async (req, res) => {
  try {
    // check keys
    const requiredKeys = ["name", "email", "password", "role"];
    const requestKeys = Object.keys(req.body);

    // check value
    const { name, email, password, role } = req.body;
    
    if (requiredKeys.some(key => !requestKeys.includes(key))) {
      return res.status(406).json({
        message: "Column names should be correct, name, email, password, role.",
      });
    };

    if ([name, email, password, role].some((field) => field?.trim() === "")) {
      return res.status(406).json({
        message: "All fields are required.",
      });
    };

    const availableRoles = ["Admin", "User"]

    if (!availableRoles.includes(role)) {
        return res.status(406).json({
            message: "Role does not match.",
          });
    };

    const existedUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({
        message: "User with this name / email already exists.",
      });
    };

    const hashedPassword = await hashPassword(password);

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
    };

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
      "message": "Internal Server Error",
      "Error": error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if ([email, password].some(field => field.trim() === "")) {
      return res.status(400).json({
        "message": "All fields are required."
      })
    };

    const doesUserExist = await prisma.users.findUnique({
      where: {
        email: email
      }
    }); 

    if (!doesUserExist) {
      return res.status(400).json({
        "message": "User does not exist, please register."
      })
    };

    const comparePassword = await comparePasswordHash(doesUserExist.password, password); // compare user pass

    if (!comparePassword) {
      return res.status(400).json({
        "message": "Incorrect Password."
      });
    };

    const user = await prisma.users.findUnique({
      where: {
        email: doesUserExist.email
      },
      omit: {
        password: true,
        rememberToken: true,
        emailVerifiedAt: true,
      },
    });

    // if everything correct.
    const token = await generateToken(user);
    
    if (!token) {
      return res.status(400).json({
        "message": "Token could not be generated."
      });
    };

    return res.status(200).json({
      "message": `${user.name} has logged in.`,
      "status": "Success",
      "data": user,
      "token": token
    });

  } catch (error) {
    return res.status(500).json({
      "message": "Internal Server Error",
      "status": "Error",
      "Error": error.message,
    });
  }
};

export const userLogout = (_,res) => {
  try {
    return res.status(200).json({
      "message": `User has logged out.`,
    });
  } catch (error) {
    return res.status(500).json({
      "Error logging out": error.message
    });
  }
};

export const getUser = async (req, res) => {
  res.status(200).json({
    "message": req.user
  });
}