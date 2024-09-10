import express from 'express';
import {register, login, getUserProfile, updateUserProfile, getAllUsers, deleteUser} from '../controllers/userController';
import { authenticateJWT, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('./register', register);
router.post('./login', login);
router.get('./profile', authenticateJWT, getUserProfile);
router.get('./profile', authenticateJWT, updateUserProfile);

//admin routes

router.get('/admin/users', authenticateJWT, isAdmin, getAllUsers);
router.delete('/admin/users/:id', authenticateJWT, isAdmin, deleteUser);

export default router;

