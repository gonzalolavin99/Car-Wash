import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuario
app.use('/api/users', userRoutes);

// Rutas de reservas
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});