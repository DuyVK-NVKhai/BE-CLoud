import express from 'express';
import * as UserController from "../controllers/user"

const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.register)

export default router;