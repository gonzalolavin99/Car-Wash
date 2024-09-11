import { Request, Response } from "express";
import { bookingModel, Booking } from "../models/booking";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking: Booking = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      booking_date: req.body.date,
      booking_time: req.body.time,
      service: req.body.service,
      vehicle_type: req.body.vehicleType,
      brand: req.body.brand,
      model: req.body.model,
      license_plate: req.body.licensePlate,
    };
    const newBooking = await bookingModel.createBooking(booking);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
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
    res
      .status(500)
      .json({
        message: "Error retrieving booking",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};

export const updateBooking = async (req:Request, res:Response) =>{
    try {
        const id = parseInt(req.params.id);
        const bookingUpdate: Partial<Booking> = req.body;
        const updatedBooking = await bookingModel.updateBooking(id, bookingUpdate);
        if (updatedBooking){
            res.json(updatedBooking);
        } else{
            res.status(404).json({message: "Booking not found"});
        }
    }catch (error){
        console.error("Error updating booking:", error);
        res.status(500).json({message: 'Error updating booking', error});
    }
};

export const deleteBooking = async (req: Request, res: Response) =>{
    try{
        const id = parseInt(req.params.id);
        const deleted = await bookingModel.deleteBooking(id);
        if(deleted){
            res.json({message: "Booking deleted successfully"});
        } else {
            res.status(404).json({message: "Booking not found"});
        }
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({message: 'Error deleting booking', error});
    }
}
