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

const ModalTipoRespuesta = ({ open, handleClose }) => {
  const classes = useStyles();
  const [pregunta, setPregunta] = useState("");
  const [tipoRespuesta, setTipoRespuesta] = useState([]);
  const [tiposRespuesta, setTiposRespuesta] = useState([]);
  const [tipoPregunta, setTipoPregunta] = useState([]);
  const [tiposPregunta, setTiposPregunta] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [openChangeTipoPreguntaDialog, setOpenChangeTipoPreguntaDialog] =
    useState(false);
  const [openChangeTipoRespuestaDialog, setOpenChangeTipoRespuestaDialog] =
    useState(false);
  const [nuevaDescripcionTipoPregunta, setNuevaDescripcionTipoPregunta] =
    useState("");
  const [nuevaDescripcionTipoRespuesta, setNuevaDescripcionTipoRespuesta] =
    useState("");

    const fetchTipoPregunta = () => {
      fetch("http://localhost:4000/tipoPregunta")
        .then((response) => response.json())
        .then((data) => {
          const tipoPreguntaOrdenadas = data.sort((a, b) => a.id - b.id);
          setTiposPregunta(tipoPreguntaOrdenadas);
        })
        .catch((error) => console.log(error));
    };

    const fetchTipoRespuesta = () => {
      fetch("http://localhost:4000/tipoRespuesta")
        .then((response) => response.json())
        .then((data) => {
          const tipoRespuestaOrdenadas = data.sort((a, b) => a.id - b.id);
          setTiposRespuesta(tipoRespuestaOrdenadas);
        })
        .catch((error) => console.log(error));
    };

    useEffect(() => {
      fetchTipoRespuesta();
      fetchTipoPregunta();
    }, []);

  // Función para manejar el cambio en el buscador
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredTipoRespuesta = tipoRespuesta.filter(
    (tipoRespuesta) =>
      tipoRespuesta.descripcion &&
      tipoRespuesta.descripcion
        .toLowerCase()
        .includes(searchValue.toLowerCase())
  );

  const filteredTipoPregunta = tipoPregunta.filter(
    (tipoPregunta) =>
      tipoPregunta.descripcion &&
      tipoPregunta.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getTipoPreguntaDescripcion = (tipoPreguntaId) => {
    const tipoPregunta = tiposPregunta.find(
      (tipoPregunta) => tipoPregunta.id === tipoPreguntaId
    );
    return tipoPregunta ? tipoPregunta.descripcion : "";
  };

  const handleChangeDescripcionTipoPregunta = (tipoPreguntaId, nuevaDescripcion) => {
    // Realiza una solicitud PATCH al servidor para actualizar la descripción del tipo de pregunta
    fetch(`http://localhost:4000/tipoPregunta/${tipoPreguntaId}`, {
      method: 'PATCH', // Utiliza PATCH en lugar de PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descripcion: nuevaDescripcion }),
    })
      .then((response) => response.json())
      .then((updatedTipoPregunta) => {
        // Actualiza el estado local con la descripción actualizada
        const updatedTiposPregunta = tiposPregunta.map((tipoPregunta) =>
          tipoPregunta.id === tipoPreguntaId
            ? { ...tipoPregunta, descripcion: updatedTipoPregunta.descripcion }
            : tipoPregunta
        );
        setTiposPregunta(updatedTiposPregunta);
        setOpenChangeTipoPreguntaDialog(false); // Cierra el diálogo después de la actualización
      })
      .catch((error) => console.log(error));
  };

  const handleChangeDescripcionTipoRespuesta = (tipoRespuestaId, nuevaDescripcion) => {
    // Realiza una solicitud PATCH al servidor para actualizar la descripción del tipo de respuesta
    fetch(`http://localhost:4000/tipoRespuesta/${tipoRespuestaId}`, {
      method: 'PATCH', // Utiliza PATCH en lugar de PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descripcion: nuevaDescripcion }),
    })
      .then((response) => response.json())
      .then((updatedTipoRespuesta) => {
        // Actualiza el estado local con la descripción actualizada
        const updatedTipoRespuestas = tipoRespuesta.map((tipo) =>
          tipo.id === tipoRespuestaId
            ? { ...tipo, descripcion: updatedTipoRespuesta.descripcion }
            : tipo
        );
        setTipoRespuesta(updatedTipoRespuestas);
        setOpenChangeTipoRespuestaDialog(false); // Cierra el diálogo después de la actualización
      })
      .catch((error) => console.log(error));
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
                      Tipo de Pregunta
                    </TableCell>
                    <TableCell className={classes.cellWithBorder}>
                      Tipo de Respuesta
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tipoRespuesta &&
                    filteredTipoRespuesta.map((tipoRespuesta) => (
                      <TableRow key={tipoRespuesta.id}>
                        <TableCell className={classes.cellWithBorder}>
                          {tipoRespuesta.id}
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          {getTipoPreguntaDescripcion(
                            tipoRespuesta.tipoPreguntaId
                          )}
                          <VpnKeyIcon
                            className="icon"
                            onClick={() => {
                              setOpenChangeTipoPreguntaDialog(true);
                              setPregunta(tipoPregunta.id);
                            }}
                          />
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          {tipoRespuesta.descripcion}
                          <VpnKeyIcon
                            className="icon"
                            onClick={() => {
                              setOpenChangeTipoRespuestaDialog(true);
                              setPregunta(tipoRespuesta.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  <Dialog
                    open={openChangeTipoRespuestaDialog}
                    onClose={() => setOpenChangeTipoRespuestaDialog(false)}
                  >
                    <DialogTitle>
                      Cambiar Descripcion del Tipo de Respuesta
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        label="Nueva Descripcion  del Tipo de Respuesta"
                        variant="outlined"
                        value={nuevaDescripcionTipoRespuesta}
                        onChange={(e) =>
                          setNuevaDescripcionTipoRespuesta(e.target.value)
                        }
                        fullWidth
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() =>
                          handleChangeDescripcionTipoRespuesta(
                            tipoRespuesta,
                            nuevaDescripcionTipoRespuesta
                          )
                        }
                        color="primary"
                      >
                        Cambiar Descripcion del tipo respuesta
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={openChangeTipoPreguntaDialog}
                    onClose={() =>
                      setOpenChangeTipoPreguntaDialog(false)
                    }
                  >
                    <DialogTitle>
                      Cambiar Descripcion del tipo de Pregunta
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        label="Nueva Descripcion del tipo Pregunta"
                        variant="outlined"
                        value={nuevaDescripcionTipoPregunta}
                        onChange={(e) =>
                          setNuevaDescripcionTipoPregunta(e.target.value)
                        }
                        fullWidth
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() =>
                          handleChangeDescripcionTipoPregunta(
                            pregunta,
                            nuevaDescripcionTipoPregunta
                          )
                        }
                        color="primary"
                      >
                        Cambiar Descripcion del Tipo de pregunta
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
   
    </>
  );
};

export default ModalTipoRespuesta;
