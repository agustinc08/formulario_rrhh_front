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

const ModalPreguntas = ({ open, handleClose }) => {
  const classes = useStyles();
  const [preguntas, setPreguntas] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [openChangeDescripcionDialog, setOpenChangeDescripcionDialog] =
    useState(false);
  const [
    openChangeDescripcionSeccionDialog,
    setOpenChangeDescripcionSeccionDialog,
  ] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const fetchPreguntas = () => {
    fetch("http://localhost:4000/preguntas")
      .then((response) => response.json())
      .then((data) => {
        const preguntasOrdenadas = data.sort((a, b) => a.id - b.id);
        setPreguntas(preguntasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
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
        `http://localhost:4000/preguntas/${preguntaId}`, // Utiliza el ID de la pregunta en la URL
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descripcion: nuevaDescripcion }),
        }
      );

      if (response.ok) {
        fetchPreguntas(); // Llama a tu función para actualizar la lista de preguntas
        setOpenChangeDescripcionSeccionDialog(false); // Cierra el diálogo si es necesario
      } else {
        console.error("Error al cambiar la descripción de la pregunta");
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
                        <VpnKeyIcon
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalPreguntas;
