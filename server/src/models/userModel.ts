import {Pool} from 'pg';
import bcrypt from 'bcrypt';
import pool from '../config/database';

export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'client'
}

export class UserModel {
    private pool: Pool;

    constructor () {
        this.pool = pool;
    }


async createUser(user: User): Promise<User> {
    const { email, name, password, role } = user;
    const query = `
      INSERT INTO users (email, name, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role
    `;

    const values = [email, name, password ? await bcrypt.hash(password,10 ) : null, role];

try{
    const result = await this.pool.query(query, values);
    return result.rows[0];
}catch (error){
    console.error("Error in createUser", error);
    throw new Error ('Failed to create user');
}
}

async getUserByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;

    try{
        const result = await this.pool.query(query, [email]);
        return result.rows[0] || null;
    } catch(error){
        console.error("Error in getUserByEmail", error);
        throw new Error ('Failed to get user');
    }
}

async updateUser(id: number, updates: Partial<User>) : Promise<User | null> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(updates);
    const query = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;

    try{
        const result = await this.pool.query(query, [id, ...values]);
        return result.rows[0] || null;
    }catch(error){
        console.error('Error in updateUser:', error);
        throw new Error ('Failed to update user');
    }
}

async deleteUser (id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';

    try{
        const result = await this.pool.query(query, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    } catch(error){
        console.error('Error in deleteUser:', error);
        throw new Error ('Failed to delete user');
    }
}

async getUserVehicles(userId: number): Promise<any[]>{
    const query = 'SELECT * FROM vehicles WHERE user_id = $1';

    try{
        const result = await this.pool.query(query, [userId]);
        return result.rows;
    } catch (error){
        console.error('Error in getUserVehicles:', error);
        throw new Error ('Failed to get user vehicles');
    }
}

async getUserVisits(userId: number): Promise<any[]>{
    const query = 'SELECT * FROM visits WHERE user_id = $1 ORDER BY visit_date DESC';

    try{
        const result = await this.pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getUserVisits:', error);
        throw new Error ('Failed to get user visits');
    }

}
}

export const userModel = new UserModel();
