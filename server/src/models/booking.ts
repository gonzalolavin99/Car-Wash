import { Pool, QueryResult } from "pg";
import pool from "../config/database";

export interface Booking {
  id: number;
  user_id: number;
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
    const fields: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];
    let counter = 1;

    Object.entries(booking).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(key);
        values.push(value);
        placeholders.push(`$${counter}`);
        counter++;
      }
    });

    const query = `
      INSERT INTO bookings (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

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

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    const query = "SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_date DESC, booking_time DESC";
    try {
      const result: QueryResult = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getBookingsByUserId:", error);
      throw new Error("Failed to get user bookings");
    }
  }
}

export const bookingModel = new BookingModel();