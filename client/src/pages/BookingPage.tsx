import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BookingPage.css";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  carBrand: string;
  carModel: string;
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
    service: "",
    carBrand: "",
    carModel: "",
    licensePlate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación del nombre
    if (formData.name.trim() === "") {
      newErrors.name = "El nombre es requerido";
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    // Validación del teléfono
    const phoneRegex = /^\+56\s?9\s?[0-9]{4}\s?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Ingrese un número de teléfono válido (+56 9 XXXX XXXX)";
    }

    // Validación de la fecha
    if (formData.date === "") {
      newErrors.date = "La fecha es requerida";
    }

    // Validación del servicio
    if (formData.service === "") {
      newErrors.service = "Seleccione un servicio";
    }

    // Validación de la marca del auto
    if (formData.carBrand.trim() === "") {
      newErrors.carBrand = "La marca del auto es requerida";
    }

    // Validación del modelo del auto
    if (formData.carModel.trim() === "") {
      newErrors.carModel = "El modelo del auto es requerido";
    }

    // Validación de la patente
    const licensePlateRegex = /^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$/;
  if (!licensePlateRegex.test(formData.licensePlate.toUpperCase())) {
    newErrors.licensePlate = "Ingrese una patente válida (AA1234 o AAAA12)";
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

  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí manejaríamos la lógica de envío del formulario
      console.log("Formulario enviado:", formData);
      toast.success("Reserva realizada con éxito!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Resetear el formulario después del envío
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        service: "",
        carBrand: "",
        carModel: "",
        licensePlate: "",
      });
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

  return (
    <div className="booking-page">
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
            aria-invalid={!!errors.date}
            aria-describedby="date-error"
          />
          {errors.date && <span id="date-error" className="error">{errors.date}</span>}
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
          <label htmlFor="carBrand">Marca del auto:</label>
          <input
            type="text"
            id="carBrand"
            name="carBrand"
            value={formData.carBrand}
            onChange={handleChange}
            required
            aria-invalid={!!errors.carBrand}
            aria-describedby="carBrand-error"
          />
          {errors.carBrand && <span id="carBrand-error" className="error">{errors.carBrand}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="carModel">Modelo del auto:</label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={formData.carModel}
            onChange={handleChange}
            required
            aria-invalid={!!errors.carModel}
            aria-describedby="carModel-error"
          />
          {errors.carModel && <span id="carModel-error" className="error">{errors.carModel}</span>}
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
          placeholder="AA1234 o AAAA12"
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