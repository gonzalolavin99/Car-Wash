import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css"; // Importamos los estilos
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  // Estado para almacenar los valores de los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth(); 

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    // Verifica que el email tenga un formato válido
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email inválido");
      return false;
    }
    // Verifica que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      toast.success("Inicio de sesión exitoso!", {
        style: { background: "#0077be", color: "white" },
      });

      login(response.data.token, response.data.user); // Usar la función login del contexto

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      toast.error('Email o contraseña incorrectos', {
        style: { background: '#ff0000', color: 'white' }
      });
    }
  };

  // Renderiza el formulario de inicio de sesión
  return (
    <div className="login-page">
      <div className="back-link">
        <Link to="/">← Volver a la página principal</Link>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>

        {/* Campo para el email */}
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

        {/* Campo para la contraseña */}
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

        {/* Botón de envío del formulario */}
        <button type="submit" className="submit-button">
          Iniciar Sesión
        </button>

        {/* Contenedor para las notificaciones de Toast */}
        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
