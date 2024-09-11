import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking } from '../controllers/bookingController';

const router = express.Router();

router.post('/', createBooking);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;