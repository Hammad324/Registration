import { prisma } from "../db/connectDB.js";
import argon2 from "argon2";
import { generateToken } from "../utils/generateJWTtoken.js";
import { comparePasswordHash, hashPassword } from "../utils/handlePassword.js";
import { blacklistToken } from "../utils/handleBlacklistedTokens.js";

export const registerUser = async (req, res) => {
  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "You are not allowed to add a resource.",
        status: "Error"
      })
    }
    // check keys
    const requiredKeys = ["name", "email", "password", "role"];
    // const requestKeys = Object.keys(req.body);
    const hasAllKeys = requiredKeys.every(key => key in req.body);

    // check value
    const { name, email, password, role } = req.body;
    
    if (!hasAllKeys) {
      return res.status(406).json({
        message: "Column names should be correct, name, email, password, role.",
        status: "Error"
      });
    };

    if ([name, email, password, role].some(field => typeof field !== "string" || field?.trim() === "")) { // if the user is not entring a string.
      return res.status(406).json({
        message: "All fields are required.",
        status: "Error"
      });
    };

    const availableRoles = ["Admin", "User"]

    if (!availableRoles.includes(role)) {
        return res.status(406).json({
            message: "Role does not match.",
            status: "Error"
          });
    };

    const existedUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({
        message: "User with this email already exists.",
      });
    };

    const hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Could not register user.",
        status: "Error"
      });
    };

    const createdUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: { // using select is a more optimal way to remove sensitive data
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "User successfully registered.",
      status: "Success",
      user: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: "Error",
      Error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if ([email, password].some(field => typeof field !== "string" || field.trim() === "")) {
      return res.status(400).json({
        message: "All fields are required.",
        status: "Error"
      })
    };

    const doesUserExist = await prisma.users.findUnique({
      where: {
        email: email
      }
    }); 

    if (!doesUserExist) {
      return res.status(404).json({
        message: "User does not exist, please register.",
        status: "Error"
      })
    };

    const comparePassword = await comparePasswordHash(doesUserExist.password, password); // compare user pass

    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect Password.",
        status: "Error"
      });
    };

    const user = await prisma.users.findUnique({
      where: {
        email: doesUserExist.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // if everything correct.
    const token = await generateToken(user);
    
    if (!token) {
      return res.status(500).json({
        message: "Token could not be generated.",
        status: "Error"
      });
    };

    return res.status(200).json({
      message: `${user.name} has logged in.`,
      status: "Success",
      data: user,
      token: token
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: "Error",
      Error: error.message,
    });
  }
};

export const userLogout = async (req, res) => {
  try {

    const token = req.header('Authorization').replace("Bearer", "").trim();
    await blacklistToken(token); // blacklist the token

    return res.status(200).json({
      message: `User has logged out.`,
      status: "Success"
    });
  } catch (error) {
    return res.status(500).json({
      "Error logging out": error.message,
      status: "Error",
      Error: error.message
    });
  }
};

export const getUser = async (req, res) => {
  res.status(200).json({
    "message": req.user
  });
};

export const changePassword = async (req, res) => {
  try {

    if (req.user.status !== 1) {
      return res.status(403).json({
        message: "You are not allowed.",
        status: "Error"
      })
    }

    const {password, newPassword} = req.body;
    
    if ([password, newPassword].some(field => typeof field !== "string" || field.trim() === "")) {
      return res.status(406).json({
        message: "All fields are required.",
        status: "Error"
      })
    };

    const user = await prisma.users.findUnique({
      where: {
        id: req.user.id
      }
    });

    const checkPassword = await comparePasswordHash(user.password, password)
    
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password is not correct.",
        status: "Error"
      })
    }

    const setNewPassword = await prisma.users.update({
      where: {
        id: req.user.id
      },
      data: {
        password: await hashPassword(newPassword)
      }
    });

    if (!setNewPassword) {
      return res.status(500).json({
        message: "Could not set a new password.",
        status: "Error"
      })
    };

    return res.status(200).json({
      message: `Password changed for "${req.user.name}"`,
      status: "Success"
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error.",
      status: "Error",
      Error: error.message
    })
  }

}