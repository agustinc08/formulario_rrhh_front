import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, Modal, TableContainer, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../css/navbar.css'; 
import '../css/global.css';

const Navbar = () => {
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [claves, setClaves] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  return (
    <>
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
          <li
            className="navbar-item"
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
          >
            <span className="navbar-link">MENU</span>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'menu',
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
            </Menu>
          </li>
        </ul>
      </nav>

      {open && selectedList === "dependencias" && (
        <Modal
          open={open}
          onClose={handleClose}
          className="modal"
        >
          <Paper className="modalContent">
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
                    <TableCell>Número</TableCell>
                    <TableCell>Dependencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dependencias.map((dependencia) => (
                    <TableRow key={dependencia.id}>
                      <TableCell>{dependencia.id}</TableCell>
                      <TableCell>{dependencia.nombreDependencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
      )}

      {open && selectedList === "preguntas" && (
        <Modal
          open={open}
          onClose={handleClose}
          className="modal"
        >
          <Paper className="modalContent">
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
                    <TableCell>Número</TableCell>
                    <TableCell>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preguntas.map((pregunta) => (
                    <TableRow key={pregunta.id}>
                      <TableCell>{pregunta.id}</TableCell>
                      <TableCell>{pregunta.descripcion}</TableCell>
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
          <Paper className="modalContent">
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
                    <TableCell>Número</TableCell>
                    <TableCell>Sección</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secciones &&
                    secciones.map((seccion) => (
                      <TableRow key={seccion.id}>
                        <TableCell>{seccion.id}</TableCell>
                        <TableCell>{seccion.descripcion}</TableCell>
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
          <Paper className="modalContent">
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
                    <TableCell>Dependencia</TableCell>
                    <TableCell>Claves</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claves.map((clave) => (
                    <TableRow key={clave.id}>
                      <TableCell>
                        {clave.dependencia.nombreDependencia}
                      </TableCell>
                      <TableCell>{clave.clave}</TableCell>
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
