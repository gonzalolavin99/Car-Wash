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
app.use('/auth', authRoutes);

// Rutas de usuario
app.use('/api/users', userRoutes);

// Rutas de reservas
app.use('/api/bookings', bookingRoutes);

console.log('Variables de entorno cargadas:');
console.log('PORT:', process.env.PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});