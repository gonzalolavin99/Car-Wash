import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Car, Trash2, Home, Calendar, LogOut } from "lucide-react";
import "../styles/ProfilePage.css";
import { useAuth } from "../contexts/AuthContext";

interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface Booking {
  id: number;
  booking_date: string;
  booking_time: string;
  service: string;
  vehicle_type: string;
  brand: string;
  model: string;
  license_plate: string;
  status: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
  bookings: Booking[];
}

const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    type: "",
    brand: "",
    model: "",
    license_plate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/users/vehicles",
        newVehicle,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProfile();
      setNewVehicle({ type: "", brand: "", model: "", license_plate: "" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/users/vehicles/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProfile();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProfile();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <Link to="/" className="nav-button">
          <Home size={20} />
          Inicio
        </Link>
        <Link to="/booking" className="nav-button">
          <Calendar size={20} />
          Reservas
        </Link>
        <button onClick={handleLogout} className="nav-button logout-button">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </nav>
      
      <h1>Perfil de Usuario</h1>
      <div className="user-info">
        <User size={48} />
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        <p>{profile.phone}</p>
      </div>

      <h3>Mis Vehículos</h3>
      <div className="vehicles-list">
        {profile.vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-item">
            <Car size={24} />
            <span>{vehicle.type} - {vehicle.brand} {vehicle.model} - {vehicle.license_plate}</span>
            <button onClick={() => handleDeleteVehicle(vehicle.id)} className="delete-btn">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <h3>Agregar Nuevo Vehículo</h3>
      <form onSubmit={handleAddVehicle} className="add-vehicle-form">
        <select
          value={newVehicle.type}
          onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
          required
        >
          <option value="">Seleccione el tipo de vehículo</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Camioneta">Camioneta</option>
          <option value="Moto">Moto</option>
        </select>
        <input
          type="text"
          placeholder="Marca"
          value={newVehicle.brand}
          onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Modelo"
          value={newVehicle.model}
          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Placa"
          value={newVehicle.license_plate}
          onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
          required
        />
        <button type="submit">Agregar Vehículo</button>
      </form>

      <h3>Mis Reservas</h3>
      <div className="bookings-list">
        {profile.bookings && profile.bookings.length > 0 ? (
          profile.bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <Calendar size={24} />
                <div className="booking-details">
                  <p><strong>Fecha y hora:</strong> {booking.booking_date} - {booking.booking_time}</p>
                  <p><strong>Servicio:</strong> {booking.service}</p>
                  <p><strong>Vehículo:</strong> {booking.vehicle_type} - {booking.brand} {booking.model} ({booking.license_plate})</p>
                  <p><strong>Estado:</strong> {booking.status}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteBooking(booking.id)} className="delete-btn">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <p>No tienes reservas actualmente.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;