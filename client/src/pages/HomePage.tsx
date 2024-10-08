import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Car, DollarSign, User } from 'lucide-react';
import '../styles/HomePage.css';
import { useAuth } from '../contexts/AuthContext';

type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

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
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <span className="welcome-message">Bienvenido, {user?.name}</span>
            <Link to="/profile" className="nav-link">
              <User size={20} />
              Perfil
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/register" className="nav-link">Registrarse</Link>
          </>
        )}
      </nav>

      <section className="hero">
        <h1>AutoSpa Deluxe</h1>
        <p>Descubre la experiencia definitiva en lavado y cuidado de autos</p>
        <Link to="/booking" className="cta-button">Reservar ahora</Link>
      </section>

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