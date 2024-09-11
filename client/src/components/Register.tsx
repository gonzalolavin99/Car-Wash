import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    // Verifica que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    // Verifica que el email tenga un formato válido
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email inválido");
      return false;
    }
    return true;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Valida el formulario antes de enviarlo
    if (!validateForm()) return;

    try {
      // Envía la solicitud de registro al servidor
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // Muestra un mensaje de éxito si el registro es exitoso
      toast.success("Registro exitoso!", {
        style: { background: "#0077be", color: "white" },
      });

      console.log(response.data);
      // Aquí puedes agregar lógica adicional post-registro, como redireccionar al usuario
    } catch (err) {
      // Muestra un mensaje de error si el registro falla
      toast.error("Error al registrar. Por favor, inténtalo de nuevo.", {
        style: { background: "#ff0000", color: "white" },
      });
    }
  };

  // Renderiza el formulario de registro
  return (
    <div className="register-page">

    <form onSubmit={handleSubmit} className="register-form">
      <div className="back-link">
        <Link to="/">← Volver a la página principal</Link>
      </div>
      <h2>Registro</h2>

      {/* Campo para el nombre */}
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

      {/* Campo para confirmar la contraseña */}
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

      {/* Botón de envío del formulario */}
      <button type="submit" className="submit-button">
        Registrarse
      </button>

      {/* Contenedor para las notificaciones de Toast */}
      <ToastContainer />
    </form>
    </div>
  );
};

export default Register;
