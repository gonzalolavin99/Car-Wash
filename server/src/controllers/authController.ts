import { Request, Response } from "express";
import { userModel, User } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }

        // Hashear la contraseña 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await userModel.createUser({
            name,
            email,
            password: hashedPassword,
            role: 'client' // Por defecto los usuarios son clientes
        } as User);

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por email
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Inicio de sesión exitoso', token, userId: user.id, role: user.role });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};