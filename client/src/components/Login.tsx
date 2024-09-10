import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  // Estado para almacenar los valores de los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    // Verifica que el email tenga un formato válido
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email inválido');
      return false;
    }
    // Verifica que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
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
      // Envía la solicitud de inicio de sesión al servidor
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });
      
      // Muestra un mensaje de éxito si el inicio de sesión es exitoso
      toast.success('Inicio de sesión exitoso!', {
        style: { background: '#0077be', color: 'white' }
      });

      // Guarda el token de autenticación en el almacenamiento local
      localStorage.setItem('token', response.data.token);
      
      // Aquí puedes agregar lógica adicional post-login, como redireccionar al usuario
    } catch (err) {
      // Muestra un mensaje de error si el inicio de sesión falla
      toast.error('Email o contraseña incorrectos', {
        style: { background: '#ff0000', color: 'white' }
      });
    }
  };

  // Renderiza el formulario de inicio de sesión
  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      
      {/* Campo para el email */}
      <div>
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
      <div>
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
      <button type="submit">Iniciar Sesión</button>

      {/* Contenedor para las notificaciones de Toast */}
      <ToastContainer />
    </form>
  );
};

export default Login;