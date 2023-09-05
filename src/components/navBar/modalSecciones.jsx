import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  TableContainer,
  IconButton,
  Table,
  TableHead,
  TableRow,
  Button,
  TableCell,
  TableBody,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import useStyles from "../../styles/navBarStyle";

const ModalSecciones = ({ open, handleClose }) => {
  const classes = useStyles();
  const [secciones, setSecciones] = useState([]);
  const [seccion, setSeccion] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [isFormularioActivo, setIsFormularioActivo] = useState(false);
  const [openChangeDescripcionDialog, setOpenChangeDescripcionDialog] =
    useState(false);
    const [openChangeTipoPreguntaDialog, setOpenChangeTipoPreguntaDialog] =
    useState(false);
    const [openChangeTipoRespuestaDialog, setOpenChangeTipoRespuestaDialog] =
    useState(false);
  const [
    openChangeDescripcionSeccionDialog,
    setOpenChangeDescripcionSeccionDialog,
  ] = useState(false);
  const [clave, setClave] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaDescripcionSeccion, setNuevaDescripcionSeccion] = useState("");

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
        const hasActiveFormulario = data.some(
          (formulario) => formulario.estaActivo
        );
        setIsFormularioActivo(hasActiveFormulario);
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
    fetchFormulario();
    fetchSecciones();
  }, []);
  
  // Función para manejar el cambio en el buscador
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredSecciones = secciones.filter(
    (seccion) =>
      seccion.descripcion &&
      seccion.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getFormularioNombre = (formularioId) => {
    const formulario = formularios.find(
      (formulario) => formulario.id === formularioId
    );
    return formulario ? formulario.nombre : "";
  };

  const handleChangeDescripcionSeccion = async (
    seccionId,
    nuevaDescripcionSeccion
  ) => {
    try {
      if (!seccionId || !nuevaDescripcionSeccion) {
        console.error(
          "Debe proporcionar un ID de Seccion y una nueva descripción."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:4000/secciones/${seccionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descripcion: nuevaDescripcionSeccion }),
        }
      );

      if (response.ok) {
        fetchSecciones();
        setOpenChangeDescripcionSeccionDialog(false);
      } else {
        console.error("Error al cambiar la descripción de la seccion");
        
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

    return (
        <>    
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
                        <TableCell className={classes.cellWithBorder}>
                          Número
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          Sección
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          Formulario
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {secciones &&
                        filteredSecciones.map((seccion) => (
                          <TableRow key={seccion.id}>
                            <TableCell className={classes.cellWithBorder}>
                              {seccion.id}
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {seccion.descripcion}
                              <VpnKeyIcon
                                className="icon"
                                onClick={() => {
                                  setOpenChangeDescripcionSeccionDialog(true);
                                  setSeccion(seccion.id);
                                }}
                              />
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {getFormularioNombre(seccion.formularioId)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Modal>
      
          <Dialog
            open={openChangeDescripcionSeccionDialog}
            onClose={() => setOpenChangeDescripcionSeccionDialog(false)}
          >
            <DialogTitle>Cambiar Descripcion de la Seccion</DialogTitle>
            <DialogContent>
              <TextField
                label="Nueva Descripcion de la Seccion"
                variant="outlined"
                value={nuevaDescripcionSeccion}
                onChange={(e) => setNuevaDescripcionSeccion(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  handleChangeDescripcionSeccion(seccion, nuevaDescripcionSeccion)
                }
                color="primary"
              >
                Cambiar Descripcion de la Seccion
              </Button>
            </DialogActions>
          </Dialog>
        </>
        )
};

export default ModalSecciones;
