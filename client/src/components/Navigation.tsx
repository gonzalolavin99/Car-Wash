import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <Link to="/" className="nav-logo">
        AutoSpa Deluxe
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="booking">Reservar</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
