import express from 'express'
import * as ThingController from "../controllers/thing"
import {authentication} from '../helper/authentication'
const router = express.Router();

router.post('/socket', authentication, ThingController.callSocket)
router.get('/', authentication, ThingController.getAllGateway)
router.get('/gateway/:gateway_id', authentication, ThingController.getGatewayById)
router.post('/gateway', authentication, ThingController.createGateway)
router.get('/gateway', authentication, ThingController.getGateway)

export default router;