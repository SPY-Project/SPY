import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/itineraryController.js";

router.get('/', ctrl.listItineraries);
router.post('/', ctrl.createItinerary);

// get/update/delete by id
router.get('/:id', ctrl.getItinerary);
router.put('/:id', ctrl.updateItinerary);
router.delete('/:id', ctrl.deleteItinerary);

export default router;