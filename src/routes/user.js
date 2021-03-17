import express from 'express';
import * as UserController from "../controllers/user"

const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)

export default router;