import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css'; // Archivo de estilos CSS para el Navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/creacion" className="navbar-link">Creaciones</Link>
        </li>
        <li className="navbar-item">
          <Link to="/buscador" className="navbar-link">Buscador</Link>
        </li>
        <li className="navbar-item">
          <Link to="/estadisticas" className="navbar-link">Estadísticas</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
