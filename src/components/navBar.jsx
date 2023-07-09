import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Modal,
  TableContainer,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField, // Agregado para el buscador
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "../css/navbar.css";
import "../css/global.css";

const Navbar = () => {
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [claves, setClaves] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formularios, setFormularios] = useState([]);
  const [dependenciaId, setDependenciaId] = useState("");
  const [seccionId, setSeccionId] = useState("");
  const [searchValue, setSearchValue] = useState(""); // Nuevo estado para el valor del buscador

  useEffect(() => {
    if (dependencias.length > 0 && dependenciaId) {
      const dependencia = dependencias.find((dep) => dep.id === dependenciaId);
    }
  }, [dependencias, dependenciaId]);

  const fetchClaves = () => {
    fetch("http://localhost:4000/claves")
      .then((response) => response.json())
      .then((data) => {
        setClaves(data);
      })
      .catch((error) => console.log(error));
  };

  const fetchPreguntas = () => {
    fetch("http://localhost:4000/preguntas")
      .then((response) => response.json())
      .then((data) => {
        const preguntasOrdenadas = data.sort((a, b) => a.id - b.id);
        setPreguntas(preguntasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  const fetchDependencias = () => {
    fetch("http://localhost:4000/dependencias")
      .then((response) => response.json())
      .then((data) => {
        const dependenciasOrdenadas = data.sort((a, b) => a.id - b.id);
        setDependencias(dependenciasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  const fetchFormulario = () => {
    fetch("http://localhost:4000/formulario")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching formularios");
        }
        return response.json();
      })
      .then((data) => {
        setFormularios(data);
      })
      .catch((error) => {
        console.log("Error fetching formularios:", error);
      });
  };

  const fetchSecciones = () => {
    fetch("http://localhost:4000/secciones")
      .then((response) => response.json())
      .then((data) => {
        const seccionesOrdenadas = data.sort((a, b) => a.id - b.id);
        setSecciones(seccionesOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchDependencias();
    fetchFormulario();
    fetchSecciones();
    fetchClaves();
    fetchPreguntas();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState("");

  const handleOpen = (list) => {
    setSelectedList(list);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el cambio en el buscador
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Filtra las preguntas por la descripción en base al valor del buscador
  const filteredPreguntas = preguntas.filter((pregunta) =>
    pregunta.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/inicio" className="navbar-link">INICIO</Link>
          </li>
          <li className="navbar-item">
            <Link to="/formulario" className="navbar-link">FORMULARIO</Link>
          </li>
          <li className="navbar-item">
            <Link to="/creacion" className="navbar-link">CREACIONES</Link>
          </li>
          <li className="navbar-item">
            <Link to="/buscador" className="navbar-link">BUSCADOR</Link>
          </li>
          <li className="navbar-item">
            <Link to="/estadisticas" className="navbar-link">ESTADÍSTICAS</Link>
          </li>
          <li className="navbar-item">
            <span className="navbar-link" onClick={handleMenuOpen}>MENU</span>
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
              <MenuItem onClick={() => handleOpen("dependencias")}>
                Dependencias
              </MenuItem>
              <MenuItem onClick={() => handleOpen("preguntas")}>
                Preguntas
              </MenuItem>
              <MenuItem onClick={() => handleOpen("secciones")}>
                Secciones
              </MenuItem>
              <MenuItem onClick={() => handleOpen("claves")}>
                Claves
              </MenuItem>
              <MenuItem onClick={() => handleOpen("formularios")}>
                Formularios
              </MenuItem>
            </Menu>
          </li>
        </ul>
      </nav>

      {open && selectedList === "dependencias" && dependencias.length > 0 && (
  <Modal open={open} onClose={handleClose} className="modal">
    <Paper className="modalContent smallModal">
      <TableContainer className="stickyTableContainer">
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="columnaId">Número</TableCell>
              <TableCell className="columnaTexto">Dependencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dependencias.map((dependencia) => (
              <TableRow key={dependencia.id}>
                <TableCell className="columnaId">{dependencia.id}</TableCell>
                <TableCell className="columnaTexto">{dependencia.nombreDependencia}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Modal>
)}

{open && selectedList === "preguntas" && (
        <Modal open={open} onClose={handleClose} className="modal">
          <Paper className="modalContent smallModal">
            <TableContainer>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <TextField // Agregado para el buscador
                label="Buscar"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaId">Número</TableCell>
                    <TableCell className="columnaTexto">Descripción</TableCell>
                    <TableCell className="columnaId">Formulario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPreguntas.map((pregunta) => (
                    <TableRow key={pregunta.id}>
                      <TableCell className="columnaId">{pregunta.id}</TableCell>
                      <TableCell className="columnaTexto">
                        {pregunta.descripcion}
                      </TableCell>
                      <TableCell className="columnaId">
                        {pregunta.formularioId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}
      {open && selectedList === "secciones" && (
        <Modal
          open={open}
          onClose={handleClose}
          className="modal"
        >
          <Paper className="modalContent smallModal">
            <TableContainer>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaId">Número</TableCell>
                    <TableCell className="columnaTexto">Sección</TableCell>
                    <TableCell className="columnaId">Formulario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secciones &&
                    secciones.map((seccion) => (
                      <TableRow key={seccion.id}>
                        <TableCell className="columnaId">{seccion.id}</TableCell>
                        <TableCell className="columnaTexto">{seccion.descripcion}</TableCell>
                        <TableCell className="columnaId">{seccion.formularioId}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}

      {open && selectedList === "formularios" && (
        <Modal
          open={open}
          onClose={handleClose}
          className="modal"
        >
          <Paper className="modalContent smallModal">
            <TableContainer>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaId">Formulario</TableCell>
                    <TableCell className="columnaTexto">Nombre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formularios &&
                    formularios.map((formulario) => (
                      <TableRow key={formulario.id}>
                        <TableCell className="columnaId">{formulario.id}</TableCell>
                        <TableCell className="columnaTexto">{formulario.descripcion}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}

      {open && selectedList === "claves" && (
        <Modal
          open={open}
          onClose={handleClose}
          className="modal"
        >
          <Paper className="modalContent smallModal">
            <TableContainer>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaTexto">Dependencia</TableCell>
                    <TableCell className="columnaTexto">Clave</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claves &&
                    claves.map((clave) => (
                      <TableRow key={clave.id}>
                        <TableCell className="columnaTexto">{clave.dependencia}</TableCell>
                        <TableCell className="columnaTexto">{clave.clave}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
