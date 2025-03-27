import { prisma } from "../db/connectDB.js";

export const createLedger = async (req, res) => {
    try {
        const { code, name, type } = req.body;

        if (
            [code, name, type].some(
                (field) => typeof field !== "string" || field?.trim() === ""
            )
        ) {
            return res.status(406).json({
                message: "All fields are required.",
                status: "Error",
            });
        }
        const allowedTypes = ["Cr", "Dr"];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                message: "Ledger type can only be debit (Dr) or credit (Cr).",
                status: "Error",
            });
        }

        const ledgerExists = await prisma.ledger.findFirst({
            where: {
                code,
            },
        });

        if (ledgerExists) {
            return res.status(409).json({
                message: "Ledger with this code already exists.",
                status: "Error",
            });
        }

        const ledger = await prisma.ledger.create({
            data: {
                userId: req.user.id,
                code,
                name,
                type,
            },
        });

        return res.status(200).json({
            message: "Ledger successfully created.",
            status: "Success",
            data: ledger,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
            status: "Error",
            error: error.message,
        });
    }
};

// export const updateDetails = async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         if (!name || !email) {
//             return res.status(400).json({
//                 message: "All fields are required",
//             });
//         }

//         const user = await prisma.users.findUnique({
//             where: {
//                 id: this._id,
//             },
//             select: {
//                 name: true,
//                 email: true,
//             }.then((updatedUser) => {
//                 return user.update({
//                     where: {
//                         id: this._id,
//                     },
//                     data: {
//                         name,
//                         email,
//                     },
//                     select: {
//                         password: false,
//                     },
//                     returnNew: true,
//                 });
//             }),
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error.",
//             status: "Error",
//             Error: error.message,
//         });
//     }
// };
