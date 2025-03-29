import { LEDGER_TYPES } from "../constants.js";
import { prisma } from "../db/connectDB.js";
import { checkIfFieldValid } from "../utils/checkFields.js";

export const createLedger = async (req, res) => {
    try {
        const { code, name, type } = req.body;

        if (!checkIfFieldValid(code, name, type)) {
            return res.status(406).json({
                message: "All fields are required.",
                status: "Error",
            });
        }

        if (!LEDGER_TYPES.includes(type)) {
            return res.status(400).json({
                message: "Ledger type can only be debit (Dr) or credit (Cr).",
                status: "Error",
            });
        }

        const existingLedger = await prisma.ledger.findUnique({
            where: {
                code,
            },
        });

        if (existingLedger) {
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
        console.log(`Error creating ledger: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error.",
            status: "Error",
        });
    }
};

export const updateLedger = async (req, res) => {
    try {
        const { code, type, name } = req.body;

        if (!checkIfFieldValid(code, type, name)) {
            return res.status(400).json({
                message: "All fields are required, in string fromat.",
                status: "Error",
            });
        }

        if (!LEDGER_TYPES.includes(type)) {
            return res.status(400).json({
                message: "Ledger type can only be debit (Dr) or credit (Cr).",
                status: "Error",
            });
        }

        const ledger = await prisma.ledger.update({
            where: {
                code,
            },
            data: {
                type,
                name,
            },
        });

        if (!ledger) {
            return res.status(400).json({
                message:
                    "Could not find ledger with this code. PLease create one and try again.",
                status: "Error",
            });
        }

        return res.status(200).json({
            message: "Ledger updated successfully.",
            status: "Success",
            data: ledger,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error.",
            status: "Error",
            Error: error.message,
        });
    }
};

export const allLedgers = async (res) => {
    const ledgers = await prisma.ledger.findMany();
    return res.status(200).json({
        message: "Retrived all ledgers successfully.",
        status: "Success",
        data: ledgers,
    });
};
