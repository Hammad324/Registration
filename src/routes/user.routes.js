import { Router } from "express";
import { registerUser, userLogin } from "../controllers/user.controllers.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(userLogin);

export default router;