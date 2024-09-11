import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Car, Trash2 } from "lucide-react";
import "../styles/ProfilePage.css";
import { useAuth } from "../contexts/AuthContext";

interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  vehicles: Vehicle[];
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Perfil de Usuario</h1>
      <div className="user-info">
        <User size={48} />
        <h2>{user?.name || profile.name}</h2>
        <p>{user?.email || profile.email}</p>
      </div>

      <h3>Mis Vehículos</h3>
      <div className="vehicles-list">
        {profile.vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-item">
            <Car size={24} />
            <span>{vehicle.brand} {vehicle.model} - {vehicle.license_plate}</span>
            <button onClick={() => handleDeleteVehicle(vehicle.id)} className="delete-btn">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <h3>Agregar Nuevo Vehículo</h3>
      <form onSubmit={handleAddVehicle} className="add-vehicle-form">
        <input
          type="text"
          placeholder="Tipo de vehículo"
          value={newVehicle.type}
          onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
          required
        />
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
    </div>
  );
};

export default ProfilePage;