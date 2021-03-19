import express from 'express'
import * as ThingController from "../controllers/thing"

const router = express.Router();

router.post('/', ThingController.createThing)
router.get('/', ThingController.getAll)
router.put('/', ThingController.updateThingInfo)
router.post('/gateway', ThingController.createGateway)

export default router;