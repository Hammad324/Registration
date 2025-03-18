import argon2 from "argon2";

// hash a password
export const hashPassword = async (password) => {
    return await argon2.hash(password);
};

// compare the hash and user provided password.
export const comparePasswordHash = async (hashedPassword, password) => {
    return await argon2.verify(hashedPassword, password);
}