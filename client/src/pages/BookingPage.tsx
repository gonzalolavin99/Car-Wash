import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BookingPage.css";
import { useAuth } from "../contexts/AuthContext";

interface BookingForm {
  name?: string;
  email?: string;
  phone?: string;
  date: string;
  time: string;
  service: string;
  vehicleId?: string;
  vehicleType?: string;
  brand?: string;
  model?: string;
  licensePlate?: string;
}

interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface FormErrors {
  [key: string]: string;
}

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookingForm>({
    date: "",
    time: "",
    service: "",
    vehicleId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [minDate, setMinDate] = useState("");
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);

    if (user) {
      fetchUserVehicles();
    }
  }, [user]);

  const fetchUserVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/users/vehicles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserVehicles(response.data);
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!user) {
      if (!formData.name) newErrors.name = "El nombre es requerido";
      if (!formData.email) newErrors.email = "El email es requerido";
      if (!formData.phone) newErrors.phone = "El teléfono es requerido";
      if (!formData.vehicleType) newErrors.vehicleType = "El tipo de vehículo es requerido";
      if (!formData.brand) newErrors.brand = "La marca es requerida";
      if (!formData.model) newErrors.model = "El modelo es requerido";
      if (!formData.licensePlate) newErrors.licensePlate = "La placa es requerida";
    } else {
      if (!formData.vehicleId) newErrors.vehicleId = "Seleccione un vehículo";
    }

    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.time) newErrors.time = "La hora es requerida";
    if (!formData.service) newErrors.service = "Seleccione un servicio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Imprimir los datos que se están enviando
        console.log("Datos de la reserva a enviar:", formData);
        
        const response = await axios.post(
          'http://localhost:3000/api/bookings',
          formData,
          { headers }
        );
        console.log("Respuesta del servidor:", response.data);
        toast.success("Reserva realizada con éxito!");
        setFormData({
          date: "",
          time: "",
          service: "",
          vehicleId: "",
        });
        navigate('/profile');
      } catch (error: any) {
        console.error("Error al enviar la reserva:", error);
        // Imprimir más detalles del error si están disponibles
        if (error.response) {
          console.error("Respuesta del servidor:", error.response.data);
        }
        toast.error("Error al realizar la reserva. Por favor, intente de nuevo.");
      }
    } else {
      toast.error("Por favor, corrija los errores en el formulario.");
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (
    <div className="booking-page">
      <div className="back-link">
        <Link to="/">← Volver a la página principal</Link>
      </div>
      <h1>Reserva tu cita</h1>
      <form onSubmit={handleSubmit}>
        {!user && (
          <>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={minDate}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="time">Hora:</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una hora</option>
            {generateTimeOptions()}
          </select>
          {errors.time && <span className="error">{errors.time}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="service">Servicio:</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un servicio</option>
            <option value="lavado-basico">Lavado Básico</option>
            <option value="lavado-completo">Lavado Completo</option>
            <option value="detallado">Detallado</option>
          </select>
          {errors.service && <span className="error">{errors.service}</span>}
        </div>
        {user ? (
          <div className="form-group">
            <label htmlFor="vehicleId">Vehículo:</label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un vehículo</option>
              {userVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.type} - {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
                </option>
              ))}
            </select>
            {errors.vehicleId && <span className="error">{errors.vehicleId}</span>}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="vehicleType">Tipo de Vehículo:</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el tipo de vehículo</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Moto">Moto</option>
              </select>
              {errors.vehicleType && <span className="error">{errors.vehicleType}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="brand">Marca:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                required
              />
              {errors.brand && <span className="error">{errors.brand}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="model">Modelo:</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model || ''}
                onChange={handleChange}
                required
              />
              {errors.model && <span className="error">{errors.model}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="licensePlate">Placa:</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate || ''}
                onChange={handleChange}
                required
              />
              {errors.licensePlate && <span className="error">{errors.licensePlate}</span>}
            </div>
          </>
        )}
        <button type="submit">Reservar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BookingPage;