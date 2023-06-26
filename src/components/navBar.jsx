import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css'; // Archivo de estilos CSS para el Navbar
import '../css/global.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/creacion" className="navbar-link">CREACIONES</Link>
        </li>
        <li className="navbar-item">
          <Link to="/buscador" className="navbar-link">BUSCADOR</Link>
        </li>
        <li className="navbar-item">
          <Link to="/estadisticas" className="navbar-link">ESTADÍSTICAS</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
