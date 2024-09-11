import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css"; // Importamos los estilos

const API_URL = "http://localhost:3000";

const Register: React.FC = () => {
  // Estado para almacenar los valores de los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      toast.success("Registro exitoso! Redirigiendo al login...", {
        style: { background: "#0077be", color: "white" },
      });

      console.log(response.data);
      
      // Limpiar el formulario
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error("Error al registrar. Por favor, inténtalo de nuevo.", {
        style: { background: "#ff0000", color: "white" },
      });
    }
  };

  // Renderiza el formulario de registro
  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="back-link">
            <Link to="/">← Volver a la página principal</Link>
          </div>
          <h2>Registro</h2>

          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Registrarse
          </button>
        </form>

        <div className="benefits-section">
          <h3>Beneficios de registrarse</h3>
          <ul>
            <li>Reserva de citas de forma rápida y sencilla</li>
            <li>Historial de servicios y visitas</li>
            <li>Notificaciones de ofertas especiales</li>
            <li>Programa de fidelidad con descuentos exclusivos</li>
            <li>Acceso a promociones para miembros registrados</li>
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
