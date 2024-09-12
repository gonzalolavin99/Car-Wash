import { Pool } from "pg";
import bcrypt from "bcrypt";
import pool from "../config/database";

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: "admin" | "client";
  phone: string; // Cambiamos a requerido
}

export interface Vehicle {
  id: number;
  user_id: number;
  type: string;
  brand: string;
  model: string;
  license_plate: string;
}

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createUser(user: User): Promise<User> {
    const { email, name, password, role, phone } = user;
    const query = `
          INSERT INTO users (email, name, password, role, phone)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, email, name, role, phone
        `;

    const values = [
      email,
      name,
      password ? await bcrypt.hash(password, 10) : null,
      role,
      phone,
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in createUser", error);
      throw new Error("Failed to create user");
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;

    try {
      const result = await this.pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getUserByEmail", error);
      throw new Error("Failed to get user");
    }
  }

  async getAllUsers(): Promise<User[]> {
    const query = "SELECT id, email, name, role FROM users";
    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw new Error("Failed to get all users");
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(updates);
    const query = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;

    try {
      const result = await this.pool.query(query, [id, ...values]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = $1";

    try {
      const result = await this.pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw new Error("Failed to delete user");
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getUserById", error);
      throw new Error("Failed to get user");
    }
  }

  async getUserVehicles(userId: number): Promise<Vehicle[]> {
    const query = "SELECT * FROM vehicles WHERE user_id = $1";
    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getUserVehicles:", error);
      throw new Error("Failed to get user vehicles");
    }
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    const query = "SELECT * FROM vehicles WHERE id = $1";
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getVehicleById:", error);
      throw new Error("Failed to get vehicle");
    }
  }

  async addVehicle(
    userId: number,
    vehicle: Omit<Vehicle, "id" | "user_id">
  ): Promise<Vehicle> {
    const query = `
        INSERT INTO vehicles (user_id, type, brand, model, license_plate)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [
      userId,
      vehicle.type,
      vehicle.brand,
      vehicle.model,
      vehicle.license_plate,
    ];
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in addVehicle:", error);
      throw new Error("Failed to add vehicle");
    }
  }

  async deleteVehicle(userId: number, vehicleId: number): Promise<boolean> {
    const query = "DELETE FROM vehicles WHERE id = $1 AND user_id = $2";
    try {
      const result = await this.pool.query(query, [vehicleId, userId]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error in deleteVehicle:", error);
      throw new Error("Failed to delete vehicle");
    }
  }

  async getUserVisits(userId: number): Promise<any[]> {
    const query =
      "SELECT * FROM visits WHERE user_id = $1 ORDER BY visit_date DESC";

    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getUserVisits:", error);
      throw new Error("Failed to get user visits");
    }
  }
}

export const userModel = new UserModel();
