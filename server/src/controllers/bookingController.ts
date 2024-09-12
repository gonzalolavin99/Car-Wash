import { Request, Response } from "express";
import { bookingModel, Booking } from "../models/booking";
import { userModel } from "../models/userModel";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Datos recibidos en createBooking:", req.body);

    let booking: Partial<Booking> = {
      booking_date: req.body.date,
      booking_time: req.body.time,
      service: req.body.service,
      status: "pending",
    };

    const user = (req as any).user;
    console.log("Usuario autenticado:", user);

    if (user) {
      // Usuario registrado
      const userDetails = await userModel.getUserById(user.id);
      if (!userDetails) {
        res.status(400).json({ message: "Usuario no encontrado" });
        return;
      }

      booking.user_id = user.id;
      booking.name = userDetails.name;
      booking.email = userDetails.email;
      booking.phone = userDetails.phone;  // Usamos el teléfono del usuario
      
      const vehicleId = parseInt(req.body.vehicleId);
      console.log("ID del vehículo seleccionado:", vehicleId);

      if (isNaN(vehicleId)) {
        res.status(400).json({ message: "ID de vehículo inválido" });
        return;
      }

      const vehicle = await userModel.getVehicleById(vehicleId);
      console.log("Vehículo encontrado:", vehicle);

      if (!vehicle) {
        res.status(400).json({ message: "Vehículo no encontrado" });
        return;
      }
      
      booking.vehicle_type = vehicle.type;
      booking.brand = vehicle.brand;
      booking.model = vehicle.model;
      booking.license_plate = vehicle.license_plate;
    } else {
      // Usuario no registrado
      booking.name = req.body.name;
      booking.email = req.body.email;
      booking.phone = req.body.phone;
      booking.vehicle_type = req.body.vehicleType;
      booking.brand = req.body.brand;
      booking.model = req.body.model;
      booking.license_plate = req.body.licensePlate;
    }

    console.log("Objeto de reserva a crear:", booking);

    const newBooking = await bookingModel.createBooking(booking as Booking);
    console.log("Nueva reserva creada:", newBooking);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error detallado al crear la reserva:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


export const getBooking = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const booking = await bookingModel.getBookingById(id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error retrieving booking:", error);
    res.status(500).json({
      message: "Error retrieving booking",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const bookingUpdate: Partial<Booking> = req.body;
    const updatedBooking = await bookingModel.updateBooking(id, bookingUpdate);
    if (updatedBooking) {
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: 'Error updating booking', error });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await bookingModel.deleteBooking(id);
    if (deleted) {
      res.json({ message: "Booking deleted successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookings = await bookingModel.getBookingsByUserId(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error retrieving user bookings:", error);
    res.status(500).json({
      message: "Error retrieving user bookings",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};