import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking, getUserBookings } from '../controllers/bookingController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateJWT, createBooking);
router.get('/user', authenticateJWT, getUserBookings);
router.get('/:id', getBooking);
router.put('/:id', authenticateJWT, updateBooking);
router.delete('/:id', authenticateJWT, deleteBooking);

export default router;