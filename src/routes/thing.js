import express from 'express'
import * as ThingController from "../controllers/thing"

const router = express.Router();

router.post('/', ThingController.createThing)
router.put('/', ThingController.updateThingInfo)
router.get('/', ThingController.getAll)
router.delete('/:thing_id', ThingController.deleteThing)
router.get('/gateway/:gateway_id', ThingController.getGatewayById)
router.post('/gateway', ThingController.createGateway)
router.get('/gateway', ThingController.getGateway)
router.get('/scan/:gateway_id', ThingController.scanThing)
router.get('/:gateway_id', ThingController.getDeviceOfGateway)

export default router;