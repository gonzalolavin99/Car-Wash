import { Request, Response } from "express";
import { userModel, User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { bookingModel } from "../models/booking";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password, phone, role = "client" } = req.body;
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = await userModel.createUser({
      email,
      name,
      password,
      phone,
      role,
    } as User);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,  // Incluimos el teléfono en la respuesta
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await userModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const vehicles = await userModel.getUserVehicles(userId);
    const bookings = await bookingModel.getBookingsByUserId(userId);
    res.json({ ...user, vehicles, bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

export const getUserVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const vehicles = await userModel.getUserVehicles(userId);
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching user vehicles:", error);
    res.status(500).json({ message: "Error fetching user vehicles", error });
  }
};

export const addVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const vehicle = await userModel.addVehicle(userId, req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error adding vehicle", error });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const vehicleId = parseInt(req.params.id);
    const deleted = await userModel.deleteVehicle(userId, vehicleId);
    if (deleted) {
      res.json({ message: "Vehicle deleted successfully" });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle", error });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const updates: Partial<User> = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await userModel.updateUser(userId, updates);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

// Admin-only functions
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await userModel.deleteUser(userId);
    if (deleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
