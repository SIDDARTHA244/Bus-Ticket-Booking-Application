import express from 'express';
import {
  searchBuses,
  getBusDetails,
  getScheduleDetails,
} from '../controllers/busController.js';

const router = express.Router();

router.get('/search', searchBuses);
router.get('/bus/:id', getBusDetails);
router.get('/schedule/:id', getScheduleDetails);

export default router;
