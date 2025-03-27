import jwt from "jsonwebtoken";

export const generateToken = async (user) => {
    try {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TOKEN_EXPIRY,
        });
        return token;
    } catch (error) {
        console.log(error.message);
    }
};
