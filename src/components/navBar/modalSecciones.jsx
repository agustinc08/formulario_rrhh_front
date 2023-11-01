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
import EditIcon from '@mui/icons-material/Edit';
import useStyles from "../../styles/navBarStyle";
import Alert from "@material-ui/lab/Alert";
import API_BASE_URL from "../../config"

const ModalSecciones = ({ open, handleClose }) => {
  const classes = useStyles();
  const [secciones, setSecciones] = useState([]);
  const [seccion, setSeccion] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [isFormularioActivo, setIsFormularioActivo] = useState(false);
  const [
    openChangeDescripcionSeccionDialog,
    setOpenChangeDescripcionSeccionDialog,
  ] = useState(false);
  const [nuevaDescripcionSeccion, setNuevaDescripcionSeccion] = useState("");
  const [alertaCreacionFallida, setAlertaCreacionFallida] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);


  const fetchFormulario = () => {
    fetch(`${API_BASE_URL}/formulario`)
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
    fetch(`${API_BASE_URL}/secciones`)
      .then((response) => response.json())
      .then((data) => {
        const seccionesOrdenadas = data.sort(
          (a, b) => a.formularioId - b.formularioId
        );
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
        console.error("Debe proporcionar un ID de Seccion y una nueva descripción.");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/secciones/${seccionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descripcion: nuevaDescripcionSeccion }),
      });
  
      if (response.ok) {
        fetchSecciones();
        setNuevaDescripcionSeccion("");
        setAlertaCreacionExitosa(true);

        setTimeout(() => {
          setAlertaCreacionExitosa(false);
        }, 2000);
        // Retrasa el cierre del diálogo por 2 segundos
        setTimeout(() => {
          setOpenChangeDescripcionSeccionDialog(false);
        }, 2000);
      } else {
        console.error("Error al cambiar la descripción de la seccion");
        setAlertaCreacionFallida(true);
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
                              <EditIcon 
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
              {alertaCreacionExitosa && (
                <Alert
                  severity="success"
                  onClose={() => setAlertaCreacionExitosa(false)}
                >
                  Descripcion de seccion modificada exitosamente.
                </Alert>
              )}
              {alertaCreacionFallida && (
                <Alert
                  severity="error"
                  onClose={() => setAlertaCreacionFallida(false)}
                >
                  Error al editar la seccion, ya contiene preguntas respondidas.
                </Alert>
              )}
            </DialogActions>
          </Dialog>
        </>
        )
};

export default ModalSecciones;
