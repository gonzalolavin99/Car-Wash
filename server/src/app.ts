    import express  from "express";
    import cors from 'cors';
    import dotenv from 'dotenv';
    import bookingRoutes from './routes/bookingRoutes.ts';

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    app.use('/api/bookings', bookingRoutes);

    app.listen(port, ()=> {
        console.log(`Server is running on port ${port}`);
    });