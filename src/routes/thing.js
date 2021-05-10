import express from 'express'
import * as ThingController from "../controllers/thing"
import {authentication} from '../helper/authentication'
const router = express.Router();

router.post('/', authentication, ThingController.createThing)
router.put('/', authentication, ThingController.updateThingInfo)
router.get('/', authentication, ThingController.getAll)
router.delete('/:thing_id', authentication, ThingController.deleteThing)
router.get('/gateway/:gateway_id', authentication, ThingController.getGatewayById)
router.post('/gateway', authentication, ThingController.createGateway)
router.get('/gateway', authentication, ThingController.getGateway)
router.get('/scan/:gateway_id', authentication, ThingController.scanThing)
router.get('/:gateway_id', authentication, ThingController.getDeviceOfGateway)

export default router;