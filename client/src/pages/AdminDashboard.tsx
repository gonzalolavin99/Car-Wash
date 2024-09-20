import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { User, Car, Calendar, Settings } from 'lucide-react';
import '../styles/AdminDashboard.css';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface BookingData {
    id: number;
    user_id: number;
    booking_date: string;
    booking_time: string;
    service: string;
    status: string;
  }

  const AdminDashboard: React.FC = () =>{
    const {user} = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [stats, useStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
    });

    useEffect(() => {
      fetchUsers();
      fetchBookings();
      fetchStats();
    }, []);

    const fetchUsers = async () => {
      try{
        const response = await axios.get('http://localhost:3001/api/admin/users', {
          headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
        });
        setUsers(response.data);
      } catch(error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchBookings = async () =>{
      try{const response = await axios.get('http://localhost:3000/api/admin/bookings', {
        headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
      });
      setBookings(response.data);
      } catch(error){
        console.error('Error fetching bookings:', error);
      }
    };

    const fetchStats = async () => {
      try{
        const response = await axios.get('http://localhost:3001/api/admin/stats', {
          headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
        });
        useStats(response.data);
      } catch(error) {
        console.error('Error fetching stats:', error);
      }
    };

    return (
      <div className="admin-dashboard">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.name}</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <User size={24} />
            <h3>Total Usuarios</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <Calendar size={24} />
            <h3>Total Reservas</h3>
            <p>{stats.totalBookings}</p>
          </div>
        </div>
  
        <div className="dashboard-sections">
          <section className="users-section">
            <h2>Usuarios Recientes</h2>
            <ul>
              {users.slice(0, 5).map(user => (
                <li key={user.id}>{user.name} - {user.email}</li>
              ))}
            </ul>
          </section>
  
          <section className="bookings-section">
            <h2>Últimas Reservas</h2>
            <ul>
              {bookings.slice(0, 5).map(booking => (
                <li key={booking.id}>
                  {booking.booking_date} - {booking.service} - {booking.status}
                </li>
              ))}
            </ul>
          </section>
        </div>
  
        <div className="admin-actions">
          <button className="admin-action-btn">
            <User size={20} />
            Gestionar Usuarios
          </button>
          <button className="admin-action-btn">
            <Car size={20} />
            Gestionar Servicios
          </button>
          <button className="admin-action-btn">
            <Calendar size={20} />
            Ver Todas las Reservas
          </button>
          <button className="admin-action-btn">
            <Settings size={20} />
            Configuración
          </button>
        </div>
      </div>
    );
  }

  export default AdminDashboard;