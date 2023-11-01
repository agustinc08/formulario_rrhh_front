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


const ModalPreguntas = ({ open, handleClose }) => {
  const classes = useStyles();
  const [preguntas, setPreguntas] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [openChangeDescripcionDialog, setOpenChangeDescripcionDialog] =
    useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [isFormularioActivo, setIsFormularioActivo] = useState(false);
  const [alertaCreacionFallida, setAlertaCreacionFallida] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);

  const fetchPreguntas = () => {
    fetch(`${API_BASE_URL}/preguntas`)
      .then((response) => response.json())
      .then((data) => {
        const preguntasOrdenadas = data.sort((a, b) => a.formularioId - b.formularioId);
        setPreguntas(preguntasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

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

  useEffect(() => {
    fetchFormulario();
    fetchPreguntas();
  }, []);

  const getFormularioNombre = (formularioId) => {
    const formulario = formularios.find(
      (formulario) => formulario.id === formularioId
    );
    return formulario ? formulario.nombre : "";
  };

  const filteredPreguntas = preguntas.filter(
    (pregunta) =>
      pregunta.descripcion &&
      pregunta.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Función para manejar el cambio en el buscador
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChangeDescripcionPregunta = async (
    preguntaId,
    nuevaDescripcion
  ) => {
    try {
      if (!preguntaId || !nuevaDescripcion) {
        console.error(
          "Debe proporcionar un ID de pregunta y una nueva descripción."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/preguntas/${preguntaId}`, // Utiliza el ID de la pregunta en la URL
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descripcion: nuevaDescripcion }),
        }
      );

      if (response.ok) {
        fetchPreguntas();
        setNuevaDescripcion("");
        setAlertaCreacionExitosa(true);
        setTimeout(() => {
          setOpenChangeDescripcionDialog(false);
        }, 2000);
      } else {
        console.error("Error al cambiar la descripción de la pregunta");
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
                      Descripción
                    </TableCell>
                    <TableCell className={classes.cellWithBorder}>
                      Formulario
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPreguntas.map((pregunta) => (
                    <TableRow key={pregunta.id}>
                      <TableCell className={classes.cellWithBorder}>
                        {pregunta.id}
                      </TableCell>
                      <TableCell className={classes.cellWithBorder}>
                        {pregunta.descripcion}
                        <EditIcon
                          className="icon"
                          onClick={() => {
                            setOpenChangeDescripcionDialog(true);
                            setPregunta(pregunta.id);
                          }}
                        />
                      </TableCell>
                      <TableCell className={classes.cellWithBorder}>
                        {getFormularioNombre(pregunta.formularioId)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Modal>
     
      <Dialog
        open={openChangeDescripcionDialog}
        onClose={() => setOpenChangeDescripcionDialog(false)}
      >
        <DialogTitle>Cambiar Descripcion de la Pregunta</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Descripcion de la Pregunta"
            variant="outlined"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              handleChangeDescripcionPregunta(pregunta, nuevaDescripcion)
            }
            color="primary"
          >
            Cambiar Descripcion de la pregunta
          </Button>
          {alertaCreacionExitosa && (
                <Alert
                  severity="success"
                  onClose={() => setAlertaCreacionExitosa(false)}
                >
                  Descripcion de la pregunta modificada exitosamente.
                </Alert>
              )}
              {alertaCreacionFallida && (
                <Alert
                  severity="error"
                  onClose={() => setAlertaCreacionFallida(false)}
                >
                  Error al editar la pregunta, ya contiene respuestas.
                </Alert>
              )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalPreguntas;
