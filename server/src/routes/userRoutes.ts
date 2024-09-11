import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers, deleteUser } from '../controllers/userController';
import { authenticateJWT, isAdmin } from '../middleware/auth';

const router = express.Router();

// Rutas de usuario autenticado
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

// Rutas de administrador
router.get('/admin/users', authenticateJWT, isAdmin, getAllUsers);
router.delete('/admin/users/:id', authenticateJWT, isAdmin, deleteUser);

export default router;