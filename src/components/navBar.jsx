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
  Button,
  TableCell,
  TableBody,
  Paper,
  TextField,
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
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState("");

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
  const filteredPreguntas = preguntas.filter(
    (pregunta) =>
      pregunta.descripcion &&
      pregunta.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filtra los elementos por el nombreDependencia en base al valor del buscador
  const filteredDependencias = dependencias.filter(
    (dependencia) =>
      dependencia.nombreDependencia &&
      dependencia.nombreDependencia
        .toLowerCase()
        .includes(searchValue.toLowerCase())
  );

  const filteredSecciones = secciones.filter(
    (seccion) =>
      seccion.descripcion &&
      seccion.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filtra las claves por la dependencia y clave en base al valor del buscador
  const filteredClaves = claves.filter(
    (clave) =>
      (clave.dependencia &&
        clave.dependencia.nombreDependencia &&
        clave.dependencia.nombreDependencia
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (clave.clave &&
        clave.clave.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const filteredFormularios = formularios.filter(
    (formulario) =>
      formulario.nombre &&
      formulario.nombre.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleToggleFormularioActivo = async (formularioToToggle) => {
    try {
      const updatedFormulario = {
        ...formularioToToggle,
        estaActivo: !formularioToToggle.estaActivo,
      };
      await fetch(`http://localhost:4000/formulario/${formularioToToggle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormulario),
      });

      // Fetch the updated formularios from the server
      fetchFormulario();
    } catch (error) {
      console.error("Error updating formulario:", error);
    }
  };

  const sortedFormularios = formularios.sort((a, b) => a.id - b.id);

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
              <MenuItem onClick={() => handleOpen("dependencias")}>
                Dependencias
              </MenuItem>
              <MenuItem onClick={() => handleOpen("preguntas")}>
                Preguntas
              </MenuItem>
              <MenuItem onClick={() => handleOpen("secciones")}>
                Secciones
              </MenuItem>
              <MenuItem onClick={() => handleOpen("claves")}>Claves</MenuItem>
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
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                margin="normal"
                style={{ width: "90%" }}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaId">Número</TableCell>
                    <TableCell className="columnaTexto">Dependencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDependencias.map((dependencia) => (
                    <TableRow key={dependencia.id}>
                      <TableCell className="columnaId">
                        {dependencia.id}
                      </TableCell>
                      <TableCell className="columnaTexto">
                        {dependencia.nombreDependencia}
                      </TableCell>
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
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                margin="normal"
                style={{ width: "90%" }}
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
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                margin="normal"
                style={{ width: "90%" }}
              />
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
                    filteredSecciones.map((seccion) => (
                      <TableRow key={seccion.id}>
                        <TableCell className="columnaId">
                          {seccion.id}
                        </TableCell>
                        <TableCell className="columnaTexto">
                          {seccion.descripcion}
                        </TableCell>
                        <TableCell className="columnaId">
                          {seccion.formularioId}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}

      {open && selectedList === "formularios" && (
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
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                margin="normal"
                style={{ width: "90%" }}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaId">Formulario</TableCell>
                    <TableCell className="columnaTexto">Nombre</TableCell>
                    <TableCell className="columnaTexto">Formulario Activo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formularios &&
                    filteredFormularios &&
                    sortedFormularios.map((formulario) => (
                      <TableRow key={formulario.id}>
                        <TableCell className="columnaId">
                          {formulario.id}
                        </TableCell>
                        <TableCell className="columnaTexto">
                          {formulario.nombre}
                        </TableCell>
                        <TableCell className="columnaTexto">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleToggleFormularioActivo(formulario)
                            }
                          >
                            {formulario.estaActivo ? "Desactivar" : "Activar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}

      {open && selectedList === "claves" && (
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
              <TextField
                label="Buscar"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                margin="normal"
                style={{ width: "90%" }}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="columnaTexto">Dependencia</TableCell>
                    <TableCell className="columnaTexto">Clave</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claves &&
                    filteredClaves.map((clave) => (
                      <TableRow key={clave.id}>
                        <TableCell className="columnaTexto">
                          {clave.dependencia.nombreDependencia}
                        </TableCell>
                        <TableCell className="columnaTexto">
                          {clave.clave}
                        </TableCell>
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
