import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking } from '../controllers/bookingController';

const router = express.Router();

router.post('/bookings', createBooking);
router.get('/bookings/:id', getBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

export default router; 