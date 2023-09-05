import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "@material-ui/core";
import "../css/navbar.css";
import "../css/global.css";
import ModalFormularios from "../components/navBar/modalFormularios";
import ModalPreguntas from "../components/navBar/modalPreguntas";
import ModalSecciones from "../components/navBar/modalSecciones";
import ModalClaves from "../components/navBar/modalClaves";
import ModalTipoRespuestas from "../components/navBar/modalTipoRespuestas";
import ModalDependencias from "../components/navBar/modalClaves";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFormularios, setOpenFormularios] = useState(false);
  const [openTipoRespuesta, setOpenTipoRespuesta] = useState(false);
  const [openClaves, setOpenClaves] = useState(false);
  const [openPreguntas, setOpenPreguntas] = useState(false);
  const [openSecciones, setOpenSecciones] = useState(false);
  const [selectedList, setSelectedList] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const modalStates = {
    formularios: openFormularios,
    claves: openClaves,
    preguntas: openPreguntas,
    secciones: openSecciones,
    tipoRespuesta: openTipoRespuesta,
  };

  const handleOpenModal = (modalName) => {
    // Verifica si el modalName existe en el objeto modalStates
    if (modalName in modalStates) {
      console.log(`Abriendo modal: ${modalName}`);
      setSelectedList(modalName); // Establece el modal que se está abriendo
      // Actualiza el estado correspondiente al modal
      const updatedStates = { ...modalStates };
      updatedStates[modalName] = true;

      // Actualiza los estados de los modales
      setOpenFormularios(updatedStates.formularios);
      setOpenClaves(updatedStates.claves);
      setOpenPreguntas(updatedStates.preguntas);
      setOpenSecciones(updatedStates.secciones);
      setOpenTipoRespuesta(updatedStates.tipoRespuesta);
    }
  };

  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/inicio" className="navbar-link">
              INICIO
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/formulario" className="navbar-link">
              FORMULARIO
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/creacion" className="navbar-link">
              CREACIONES
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/buscador" className="navbar-link">
              BUSCADOR
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/estadisticas" className="navbar-link">
              ESTADÍSTICAS
            </Link>
          </li>
          <li className="navbar-item">
            <span className="navbar-link" onClick={handleMenuOpen}>
              MENU
            </span>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              getContentAnchorEl={null}
              MenuListProps={{
                "aria-labelledby": "menu",
              }}
            >
              <MenuItem onClick={() => handleOpenModal("formularios")}>
                Formularios
              </MenuItem>
              <MenuItem onClick={() => handleOpenModal("claves")}>
                Dependencias
              </MenuItem>
              <MenuItem onClick={() => handleOpenModal("preguntas")}>
                Preguntas
              </MenuItem>
              <MenuItem onClick={() => handleOpenModal("secciones")}>
                Secciones
              </MenuItem>
              <MenuItem onClick={() => handleOpenModal("tipoRespuesta")}>
                Tipo de Respuesta
              </MenuItem>
            </Menu>
          </li>
        </ul>
      </nav>
      <ModalFormularios
        open={openFormularios}
        handleClose={() => setOpenFormularios(false)}
      />
      <ModalClaves open={openClaves} handleClose={() => setOpenClaves(false)} />
      <ModalPreguntas
        open={openPreguntas}
        handleClose={() => setOpenPreguntas(false)}
      />
      <ModalSecciones
        open={openSecciones}
        handleClose={() => setOpenSecciones(false)}
      />
      <ModalTipoRespuestas
        open={openTipoRespuesta}
        handleClose={() => setOpenTipoRespuesta(false)}
      />
    </>
  );
};

export default Navbar;
