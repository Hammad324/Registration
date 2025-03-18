import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, userLogin, userLogout, getUser } from "../controllers/user.controllers.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(userLogin);
router.route('/logout').post(verifyJWT, userLogout);
router.route('/me').get(verifyJWT, getUser);

export default router;