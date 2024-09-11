import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Car, DollarSign } from 'lucide-react';
import '../styles/HomePage.css';

// Definimos un tipo para nuestros servicios
type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

// Componente funcional para la página de inicio
const HomePage: React.FC = () => {
  // Definimos nuestros servicios principales
  const services: Service[] = [
    {
      icon: <Calendar size={24} />,
      title: "Reserva fácil",
      description: "Agenda tu cita en segundos"
    },
    {
      icon: <Car size={24} />,
      title: "Servicios premium",
      description: "Cuidado experto para tu vehículo"
    },
    {
      icon: <DollarSign size={24} />,
      title: "Precios competitivos",
      description: "Calidad superior a precios justos"
    }
  ];

  return (
    <div className="home-page">
      {/* Sección de navegación */}
      <nav className="nav-links">
        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        <Link to="/register" className="nav-link">Registrarse</Link>
      </nav>

      {/* Sección de hero */}
      <section className="hero">
        <h1>AutoSpa Deluxe</h1>
        <p>Descubre la experiencia definitiva en lavado y cuidado de autos</p>
        <Link to="/booking" className="cta-button">Reservar ahora</Link>
      </section>

      {/* Sección de servicios */}
      <section className="services">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            {service.icon}
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;