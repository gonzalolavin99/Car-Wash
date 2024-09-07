import React from 'react';
import { Calendar, Car, DollarSign } from 'lucide-react';
import '../styles/HomePage.css'; // Importamos los estilos

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
      {/* Sección de hero */}
      <section className="hero">
        <h1>AutoSpa Deluxe</h1>
        <p>Descubre la experiencia definitiva en lavado y cuidado de autos</p>
        <button className="cta-button">Reservar ahora</button>
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