import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Container,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import "../components/global.css";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(2),
  },
  subtitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
    borderBottom: "2px solid black",
  },
  mainTitle: {
    fontSize: "2.7rem",
    textAlign: "center",
    marginBottom: "30px",
  },
  tituloPregunta: {
    textAlign: "center",
    marginTop: "15px",
  },
  pregunta: {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    borderRadius: "5px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "normal",
    width: "100px",
    height: "250px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ccc",
    lineHeight: "120px",
  },
  enviarButton: {
    marginTop: theme.spacing(2),
  },
}));

function Preguntas() {
  const classes = useStyles();
  const [preguntas, setPreguntas] = useState([]);
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [dependencia, setDependencia] = useState("");
  const [dependencias, setDependencias] = useState([]);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [seccionId, setSeccionId] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [preguntasPorSeccion, setPreguntasPorSeccion] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [respuestas, setRespuestas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [error, setError] = useState(false);

  function handleEdadChange(event) {
    setEdad(event.target.value);
  }

  function handleGeneroChange(event) {
    setGenero(event.target.value);
  }

  function handleDependenciaChange(event) {
    setDependencia(event.target.value);
  }

  function handleComentarioChange(event, preguntaId) {
    const { value } = event.target;

    setComentarios((prevComentarios) => ({
      ...prevComentarios,
      [preguntaId]: value,
    }));
  }

  function handleExpresionChange(event, preguntaId) {
    const { value } = event.target;

    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: {
        ...prevRespuestas[preguntaId],
        expresion: value,
      },
    }));
  }

  function handleCalificacionesChange(event, preguntaId) {
    const { value } = event.target;

    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: {
        ...prevRespuestas[preguntaId],
        calificaciones: value,
      },
    }));
  }

  function handleClasificacionesChange(event, preguntaId) {
    const { value } = event.target;

    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: {
        ...prevRespuestas[preguntaId],
        clasificaciones: value,
      },
    }));
  }

  function handleGradoChange(event, preguntaId) {
    const { value } = event.target;

    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: {
        ...prevRespuestas[preguntaId],
        grado: value,
      },
    }));
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  async function enviarRespuestas(event) {
    event.preventDefault();
    const respuestasData = [];

    // Verificar si alguna pregunta no tiene opción seleccionada
    const preguntaSinSeleccion = preguntas.find((pregunta) => {
      const respuesta = respuestas[pregunta.id];
      return !respuesta || Object.keys(respuesta).length === 0;
    });

    if (preguntaSinSeleccion) {
      setError(true);
      return; // Detener el envío del formulario
    }

    // Iterar sobre preguntasPorSeccion
    for (const seccionId in preguntasPorSeccion) {
      const preguntas = preguntasPorSeccion[seccionId];
      const respuestasSeccion = preguntas.map((pregunta) => {
        const { id: preguntaId, tieneComentario } = pregunta;
        const { expresion, calificaciones, clasificaciones, grado } =
          respuestas[preguntaId] || {};

        return {
          preguntaId,
          dependenciaId: parseInt(dependencia),
          respuestaText:
            expresion || calificaciones || clasificaciones || grado,
          comentario: tieneComentario ? comentarios[preguntaId] || null : null,
        };
      });

      // Agregar respuestas de la sección actual a respuestasData
      respuestasData.push(...respuestasSeccion);
    }

    const createRespuestaDto = {
      respuestas: respuestasData,
      edad,
      genero,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/respuestas",
        createRespuestaDto
      );
      console.log(response.data);
      setSnackbarMessage("El formulario fue enviado correctamente.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        "Su formulario no pudo ser enviado. Faltan respuestas."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/dependencias");
      const data = await response.json();
      setDependencias(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function cargarSecciones() {
      try {
        const { data } = await axios.get("http://localhost:3000/secciones");
        setSecciones(data);
        setSeccionId(data[0]?.id); // Establecer la primera sección como sección actual
      } catch (error) {
        console.error(error);
      }
    }
    cargarSecciones();
  }, []);

  useEffect(() => {
    async function cargarPreguntasPorSeccion() {
      if (seccionId) {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/preguntas/${seccionId}`
          );

          // Actualizar el estado preguntasPorSeccion con las nuevas preguntas
          setPreguntasPorSeccion((prevPreguntasPorSeccion) => ({
            ...prevPreguntasPorSeccion,
            [seccionId]: data,
          }));

          // Establecer la página actual como la primera página
          setCurrentPage(1);
        } catch (error) {
          console.error(error);
        }
      }
    }
    cargarPreguntasPorSeccion();
  }, [seccionId]);

  useEffect(() => {
    if (preguntasPorSeccion[seccionId]) {
      const startIndex = (currentPage - 1) * 5;
      const endIndex = startIndex + 5;
      const slicedPreguntas = preguntasPorSeccion[seccionId]?.slice(
        startIndex,
        endIndex
      );
      setPreguntas(slicedPreguntas);
    }
  }, [preguntasPorSeccion, seccionId, currentPage]);

  return (
    <Container>
      <Typography variant="h4" className={classes.tituloPregunta}>
        {mensaje}
        {seccionId &&
          secciones.length > 0 &&
          secciones.find((seccion) => seccion.id === seccionId)?.descripcion}
      </Typography>
      <Divider />
      <form onSubmit={enviarRespuestas}>
        {error && (
          <Typography variant="body1" color="error">
            Por favor, selecciona una opción en todas las preguntas.
          </Typography>
        )}
        {isFirstPage && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <FormControl
                  error={error}
                  variant="outlined"
                  fullWidth
                  size="small"
                >
                  <InputLabel>Edad</InputLabel>
                  <Select
                    name="edad"
                    value={edad}
                    onChange={handleEdadChange}
                    label="Edad"
                    required
                  >
                    <MenuItem value="DESDE_18_A_45">
                      Desde 18 a 45 Años
                    </MenuItem>
                    <MenuItem value="MAS_45">Mas de 45 Años</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel>Género</InputLabel>
                  <Select
                    name="genero"
                    value={genero}
                    onChange={handleGeneroChange}
                    label="Género"
                    required
                  >
                    <MenuItem value="MASCULINO">Masculino</MenuItem>
                    <MenuItem value="FEMENINO">Femenino</MenuItem>
                    <MenuItem value="OTRO">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel>Dependencia</InputLabel>
                  <Select
                    key={dependencia.id}
                    name="dependencia"
                    value={dependencia}
                    onChange={handleDependenciaChange}
                    label="Dependencia"
                    required
                  >
                    {dependencias.map((dependencia) => (
                      <MenuItem key={dependencia.id} value={dependencia.id}>
                        {dependencia.nombreDependencia}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        <Box height={50} />
        <Grid container spacing={2}>
          {preguntasPorSeccion[seccionId]?.map((pregunta) => (
            <Grid item xs={12} sm={6} md={6} key={pregunta.id}>
              <ListItem>
                <Box
                  className="pregunta"
                  display="flex"
                  flexDirection="column"
                  boxShadow={6}
                  borderRadius={5}
                  p={2}
                  mb={2}
                  width={"100%"}
                  height={"300px"}
                  value={pregunta.id}
                >
                  <Typography>
                    <Box sx={{ fontSize: 18, paddingTop: 10 }}>
                      {pregunta.descripcion}
                    </Box>
                  </Typography>
                  <br />
                  <Grid container spacing={2}>
                    {pregunta.tieneExpresion && (
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id={`respuesta-${pregunta.id}-label`}>
                            ¿Qué opinas?
                          </InputLabel>
                          <Select
                            name="expresion"
                            value={respuestas[pregunta.id]?.expresion || ""}
                            onChange={(event) =>
                              handleExpresionChange(event, pregunta.id)
                            }
                            label="expresion"
                            required
                          >
                            <MenuItem value="SI">Sí</MenuItem>
                            <MenuItem value="NO">No</MenuItem>
                            <MenuItem value="NO_SE">No lo sé</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {pregunta.tieneCalificaciones && (
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id={`respuesta-${pregunta.id}-label`}>
                            Calificacion
                          </InputLabel>
                          <Select
                            name="calificaciones"
                            value={
                              respuestas[pregunta.id]?.calificaciones || ""
                            }
                            onChange={(event) =>
                              handleCalificacionesChange(event, pregunta.id)
                            }
                            label="Calificaciones"
                            required
                          >
                            <MenuItem value="">Seleccionar</MenuItem>
                            <MenuItem value="SIEMPRE">SIEMPRE</MenuItem>
                            <MenuItem value="CASI_SIEMPRE">
                              CASI SIEMPRE
                            </MenuItem>
                            <MenuItem value="A_VECES">A VECES</MenuItem>
                            <MenuItem value="CASI_NUNCA">CASI NUNCA</MenuItem>
                            <MenuItem value="NUNCA">NUNCA</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {pregunta.tieneClasificaciones && (
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id={`respuesta-${pregunta.id}-label`}>
                            Clasificaciones
                          </InputLabel>
                          <Select
                            name="clasificaciones"
                            value={
                              respuestas[pregunta.id]?.clasificaciones || ""
                            }
                            onChange={(event) =>
                              handleClasificacionesChange(event, pregunta.id)
                            }
                            label="clasificaciones"
                            required
                          >
                            <MenuItem value="MUY_BUENO">Muy Bueno</MenuItem>
                            <MenuItem value="BUENO">Bueno</MenuItem>
                            <MenuItem value="REGULAR">Regular</MenuItem>
                            <MenuItem value="MALO">Malo</MenuItem>
                            <MenuItem value="MUY_MALO">Muy Malo</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {pregunta.tieneGrado && (
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id={`respuesta-${pregunta.id}-label`}>
                            Grado
                          </InputLabel>
                          <Select
                            name="grado"
                            value={respuestas[pregunta.id]?.grado || ""}
                            onChange={(event) =>
                              handleGradoChange(event, pregunta.id)
                            }
                            label="grado"
                            required
                          >
                            <MenuItem value="ALTA">Alta</MenuItem>
                            <MenuItem value="MEDIA">Media</MenuItem>
                            <MenuItem value="BAJA">Baja</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {pregunta.tieneComentario && (
                      <Grid item xs={12}>
                        <TextField
                          name="comentario"
                          label="Comentario"
                          value={comentarios[pregunta.id] || ""}
                          onChange={(event) =>
                            handleComentarioChange(event, pregunta.id)
                          }
                          error={error}
                          fullWidth
                          multiline
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </ListItem>
            </Grid>
          ))}
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <Box display="flex" justifyContent="center">
          {isLastPage && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.enviarButton}
            >
              Enviar
            </Button>
          )}
        </Box>
      </form>
      <Pagination
        style={{ marginBottom: "20px" }}
        count={secciones.length}
        page={secciones.findIndex((seccion) => seccion.id === seccionId) + 1}
        onChange={(event, value) => {
          const pageIndex = value - 1;
          const selectedSeccionId = secciones[pageIndex]?.id;
          setSeccionId(selectedSeccionId);
          setIsFirstPage(pageIndex === 0);
          setIsLastPage(pageIndex === secciones.length - 1);
        }}
      />
    </Container>
  );
}

export default Preguntas;
