import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  makeStyles,
  TextField,
  Box,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    maxWidth: 600,
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  button: {
    alignSelf: "flex-end",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Creacion() {
  const classes = useStyles();
  const [seccion, setSeccion] = useState("");
  const [preguntaDescripcion, setPreguntaDescripcion] = useState("");
  const [preguntaTieneComentario, setPreguntaTieneComentario] = useState(false);
  const [preguntaTieneExpresion, setPreguntaTieneExpresion] = useState(false);
  const [preguntaTieneCalificaciones, setPreguntaTieneCalificaciones] =
    useState(false);
  const [preguntaTieneClasificaciones, setPreguntaTieneClasificaciones] =
    useState(false);
  const [preguntaTieneGrado, setPreguntaTieneGrado] = useState(false);
  const [dependencia, setDependencia] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleSeccionChange = (event) => {
    setSeccion(event.target.value);
  };

  const handlePreguntaDescripcionChange = (event) => {
    setPreguntaDescripcion(event.target.value);
  };

  const handlePreguntaTieneComentarioChange = (event) => {
    setPreguntaTieneComentario(event.target.value === "SI");
  };

  const handlePreguntaTieneExpresionChange = (event) => {
    setPreguntaTieneExpresion(event.target.value === "SI");
  };

  const handlePreguntaTieneCalificacionesChange = (event) => {
    setPreguntaTieneCalificaciones(event.target.value === "SI");
  };

  const handlePreguntaTieneClasificacionesChange = (event) => {
    setPreguntaTieneClasificaciones(event.target.value === "SI");
  };

  const handlePreguntaTieneGradoChange = (event) => {
    setPreguntaTieneGrado(event.target.value === "SI");
  };

  const handleDependenciaChange = (event) => {
    setDependencia(event.target.value);
  };

  const handleSubmitDependencia = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/dependencias", {
        nombreDependencia: dependencia,
      });

      setOpenSnackbar(true);
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage("Error al crear la dependencia");
      setSnackbarSeverity("error");
    }
  };

  const handleSubmitPregunta = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/preguntas", {
        descripcion: preguntaDescripcion,
        tieneComentario: preguntaTieneComentario,
        tieneExpresion: preguntaTieneExpresion,
        tieneCalificaciones: preguntaTieneCalificaciones,
        tieneClasificaciones: preguntaTieneClasificaciones,
        tieneGrado: preguntaTieneGrado,
      });

      setOpenSnackbar(true);
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage("Error al crear la pregunta");
      setSnackbarSeverity("error");
    }
  };

  const handleSubmitSeccion = async (event) => {
    event.preventDefault();

    try {
      // Lógica para crear la sección utilizando el valor de "seccion"
      const response = await axios.post("http://localhost:3000/secciones", {
        descripcion: seccion,
      });

      setOpenSnackbar(true);
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage("Error al crear la sección");
      setSnackbarSeverity("error");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Creación
      </Typography>

      <form className={classes.form}>
        <Box className={classes.section}>
          <Typography variant="h5">Sección</Typography>

          <TextField
            label="Descripción de la sección"
            value={seccion}
            onChange={handleSeccionChange}
          />

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleSubmitSeccion}
          >
            Crear Sección
          </Button>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5">Pregunta</Typography>

          <TextField
            label="Descripción de la pregunta"
            value={preguntaDescripcion}
            onChange={handlePreguntaDescripcionChange}
          />

          <FormControl>
            <InputLabel id="comentario-label">¿Tiene Comentario?</InputLabel>
            <Select
              labelId="comentario-label"
              value={preguntaTieneComentario ? "SI" : "NO"}
              onChange={handlePreguntaTieneComentarioChange}
            >
              <MenuItem value={"SI"}>Sí</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="expresion-label">¿Tiene Expresión?</InputLabel>
            <Select
              labelId="expresion-label"
              value={preguntaTieneExpresion ? "SI" : "NO"}
              onChange={handlePreguntaTieneExpresionChange}
            >
              <MenuItem value={"SI"}>Sí</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="calificaciones-label">¿Tiene Calificaciones?</InputLabel>
            <Select
              labelId="calificaciones-label"
              value={preguntaTieneCalificaciones ? "SI" : "NO"}
              onChange={handlePreguntaTieneCalificacionesChange}
            >
              <MenuItem value={"SI"}>Sí</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="clasificaciones-label">¿Tiene Clasificaciones?</InputLabel>
            <Select
              labelId="clasificaciones-label"
              value={preguntaTieneClasificaciones ? "SI" : "NO"}
              onChange={handlePreguntaTieneClasificacionesChange}
            >
              <MenuItem value={"SI"}>Sí</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="grado-label">¿Tiene Grado?</InputLabel>
            <Select
              labelId="grado-label"
              value={preguntaTieneGrado ? "SI" : "NO"}
              onChange={handlePreguntaTieneGradoChange}
            >
              <MenuItem value={"SI"}>Sí</MenuItem>
              <MenuItem value={"NO"}>No</MenuItem>
            </Select>
          </FormControl>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleSubmitPregunta}
          >
            Crear Pregunta
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Creacion;
