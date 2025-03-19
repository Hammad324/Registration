import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, userLogin, userLogout, getUser, changePassword } from "../controllers/user.controllers.js";

const router = Router();

router.route('/login').post(userLogin);

// protected routes
router.route('/register').post(verifyJWT, registerUser);
router.route('/logout').post(verifyJWT, userLogout);
router.route('/me').get(verifyJWT, getUser);
router.route('/change-password').post(verifyJWT, changePassword)

export default router;