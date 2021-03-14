import express from 'express'
import * as ThingController from "../controllers/thing"

const router = express.Router();

router.post('/create', ThingController.createThing)