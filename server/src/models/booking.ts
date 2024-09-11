import { Pool, QueryResult } from "pg";
import pool from "../config/database";

export interface Booking {
  id?: number;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  service: string;
  vehicle_type: string;
  brand: string;
  model: string;
  license_plate: string;
  status?: string;
}

export class BookingModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createBooking(booking: Booking): Promise<Booking> {
    const query = `
      INSERT INTO bookings (name, email, phone, booking_date, booking_time, service, vehicle_type, brand, model, license_plate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      booking.name,
      booking.email,
      booking.phone,
      booking.booking_date,
      booking.booking_time,
      booking.service,
      booking.vehicle_type,
      booking.brand,
      booking.model,
      booking.license_plate,
    ];

    try {
      const result: QueryResult = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in createBooking:", error);
      throw new Error("Failed to create booking");
    }
  }

  async getBookingById(id: number): Promise<Booking | null> {
    const query = "SELECT * FROM bookings WHERE id = $1";
    try {
      const result: QueryResult = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getBookingById:", error);
      throw new Error("Failed to get booking");
    }
  }

  async updateBooking(
    id: number,
    booking: Partial<Booking>
  ): Promise<Booking | null> {
    const fields = Object.keys(booking)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(booking);
    const query = `UPDATE bookings SET ${fields} WHERE id = $1 RETURNING *`;

    try {
      const result: QueryResult = await this.pool.query(query, [id, ...values]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in updateBooking:", error);
      throw new Error("Failed to update booking");
    }
  }

  async deleteBooking(id: number): Promise<boolean> {
    const query = "DELETE FROM bookings WHERE id = $1";
    try {
      const result: QueryResult = await this.pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error in deleteBooking:", error);
      throw new Error("Failed to delete booking");
    }
  }
}

export const bookingModel = new BookingModel();
