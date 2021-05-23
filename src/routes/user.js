import express from 'express';
import * as UserController from "../controllers/user"
import {authentication} from '../helper/authentication'

const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.patch('/password', authentication, UserController.changePassword)
router.get('/token', authentication, UserController.auth)

export default router;