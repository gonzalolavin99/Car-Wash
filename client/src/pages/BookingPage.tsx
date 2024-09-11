import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; // Asegúrate de tener axios instalado

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BookingPage.css";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  vehicleType: string;
  brand: string;
  model: string;
  licensePlate: string;
}

interface FormErrors {
  [key: string]: string;
}

const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    vehicleType: "auto",
    brand: "",
    model: "",
    licensePlate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "El nombre es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    const phoneRegex = /^\+56\s?9\s?[0-9]{4}\s?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Ingrese un número de teléfono válido (+56 9 XXXX XXXX)";
    }

    if (formData.date === "") {
      newErrors.date = "La fecha es requerida";
    }

    if (formData.time === "") {
      newErrors.time = "La hora es requerida";
    }

    if (formData.service === "") {
      newErrors.service = "Seleccione un servicio";
    }

    if (formData.brand.trim() === "") {
      newErrors.brand = "La marca del vehículo es requerida";
    }

    if (formData.model.trim() === "") {
      newErrors.model = "El modelo del vehículo es requerido";
    }

    if (formData.licensePlate.trim() === "") {
      newErrors.licensePlate = "La patente es requerida";
    }

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
        const response = await axios.post('http://localhost:3000/api/bookings', formData);        console.log("Respuesta del servidor:", response.data);
        toast.success("Reserva realizada con éxito!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          service: "",
          vehicleType: "auto",
          brand: "",
          model: "",
          licensePlate: "",
        });
      } catch (error) {
        console.error("Error al enviar la reserva:", error);
        toast.error("Error al realizar la reserva. Por favor, intente de nuevo.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error("Por favor, corrija los errores en el formulario.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && <span id="name-error" className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && <span id="email-error" className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            aria-invalid={!!errors.phone}
            aria-describedby="phone-error"
            placeholder="+56 9 XXXX XXXX"
          />
          {errors.phone && <span id="phone-error" className="error">{errors.phone}</span>}
        </div>
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
            aria-invalid={!!errors.date}
            aria-describedby="date-error"
          />
          {errors.date && <span id="date-error" className="error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="time">Hora:</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            aria-invalid={!!errors.time}
            aria-describedby="time-error"
          >
            <option value="">Selecciona una hora</option>
            {generateTimeOptions()}
          </select>
          {errors.time && <span id="time-error" className="error">{errors.time}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="service">Servicio:</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            aria-invalid={!!errors.service}
            aria-describedby="service-error"
          >
            <option value="">Selecciona un servicio</option>
            <option value="lavado-basico">Lavado Básico</option>
            <option value="lavado-completo">Lavado Completo</option>
            <option value="detallado">Detallado</option>
          </select>
          {errors.service && <span id="service-error" className="error">{errors.service}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="vehicleType">Tipo de Vehículo:</label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          >
            <option value="auto">Auto</option>
            <option value="moto">Moto</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="brand">Marca del vehículo:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            aria-invalid={!!errors.brand}
            aria-describedby="brand-error"
          />
          {errors.brand && <span id="brand-error" className="error">{errors.brand}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="model">Modelo del vehículo:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            aria-invalid={!!errors.model}
            aria-describedby="model-error"
          />
          {errors.model && <span id="model-error" className="error">{errors.model}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="licensePlate">Patente:</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
            aria-invalid={!!errors.licensePlate}
            aria-describedby="licensePlate-error"
          />
          {errors.licensePlate && <span id="licensePlate-error" className="error">{errors.licensePlate}</span>}
        </div>
        <button type="submit">Reservar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BookingPage;