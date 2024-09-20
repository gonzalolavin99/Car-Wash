import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { bookingModel } from "../models/booking";

// Controlador para obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Controlador para obtener todas las reservas
export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Controlador para obtener estadísticas
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await userModel.getTotalUsers();
    const totalBookings = await bookingModel.getTotalBookings();

    res.json({
      totalUsers,
      totalBookings
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// Otros controladores para funciones administrativas pueden ser agregados aquí