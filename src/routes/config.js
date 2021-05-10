import express from 'express'
import * as ConfigController from "../controllers/config"
import {authentication} from '../helper/authentication'
const router = express.Router();

router.post('/', authentication, ConfigController.forwardHass)

export default router;