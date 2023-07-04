import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
import Pagination from "@material-ui/lab/Pagination";
import "../css/global.css";
import "../css/formulario.css";
import useStyles from "../styles/formularioStyle";

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
  const [tipoRespuesta, setTipoRespuesta] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [mensaje] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [error, setError] = useState(false);
  const [preguntasSinSeleccion, setPreguntasSinSeleccion] = useState(false);
  const [preguntasSinResponder, setPreguntasSinResponder] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [tipoPregunta, setTipoPregunta] = useState({});
  const [preguntasRequierenComentario, setPreguntaRequierenComentario] =
    useState(false);
  const history = useHistory();
  const redirectTimer = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3000/dependencias");
        setDependencias(data);
      } catch (error) {
        console.error(error);
      }
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
    async function cargarPreguntasPorSeccion(seccionId) {
      if (seccionId) {
        try {
          const [preguntasResponse, tiposPreguntaResponse] = await Promise.all([
            axios.get(`http://localhost:3000/preguntas/${seccionId}`),
            axios.get("http://localhost:3000/tipoPregunta"),
          ]);

          setPreguntasPorSeccion((prevPreguntasPorSeccion) => ({
            ...prevPreguntasPorSeccion,
            [seccionId]: preguntasResponse.data,
          }));
          setTipoPregunta(tiposPreguntaResponse.data); // Agregar esta línea para establecer los tipos de pregunta
          setCurrentPage(1);
          setPreguntaActual(preguntasResponse.data[0]?.id);
        } catch (error) {
          console.error(error);
        }
      }
    }

    cargarPreguntasPorSeccion(seccionId);
  }, [seccionId, setPreguntaActual]);

  useEffect(() => {
    if (preguntasPorSeccion[seccionId]) {
      const startIndex = (currentPage - 1) * 5;
      const endIndex = startIndex + 5;
      const slicedPreguntas = preguntasPorSeccion[seccionId]?.slice(
        startIndex,
        endIndex
      );
      setPreguntas(slicedPreguntas);
    } else {
      cargarPreguntasPorSeccion();
    }
  }, [seccionId, setPreguntaActual, preguntaActual]);

  useEffect(() => {
    async function fetchTipoRespuesta() {
      try {
        const { data } = await axios.get("http://localhost:3000/tipoRespuesta");
        setTipoRespuesta(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTipoRespuesta();
  }, []);

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

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  async function cargarPreguntasPorSeccion(
    seccionId,
    setPreguntasPorSeccion,
    setCurrentPage,
    setPreguntaActual
  ) {
    if (seccionId) {
      axios
        .get(`http://localhost:3000/preguntas/${seccionId}`)
        .then((response) => {
          setPreguntasPorSeccion((prevPreguntasPorSeccion) => ({
            ...prevPreguntasPorSeccion,
            [seccionId]: response.data,
          }));
          setCurrentPage(1);
          setPreguntaActual(response.data[0]?.id); // Establecer la primera pregunta como pregunta actual
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async function enviarRespuestas(event) {
    event.preventDefault();
    const respuestasData = [];
    let preguntasSinComentario = false;
    let preguntasSinSeleccion = {};

    // Verificar si hay preguntas sin comentario o con comentario vacío
    for (const preguntaId in comentarios) {
      const comentario = comentarios[preguntaId];
      if (!comentario && preguntasRequierenComentario.includes(preguntaId)) {
        preguntasSinComentario = true;
        break;
      }
    }

    if (preguntasSinComentario) {
      setError(true);
      setSnackbarMessage(
        "Por favor, proporciona un comentario en las preguntas que lo requieran."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Verificar si hay preguntas sin selección
    for (const preguntaId in respuestas) {
      const respuesta = respuestas[preguntaId];
      if (
        !respuesta.expresion &&
        !respuesta.calificaciones &&
        !respuesta.clasificaciones &&
        !respuesta.grado
      ) {
        preguntasSinSeleccion[preguntaId] = true;
      }
    }

    if (Object.keys(preguntasSinSeleccion).length > 0) {
      setError(true);
      setPreguntasSinSeleccion(true);
      setPreguntasSinResponder(preguntasSinSeleccion);
      setSnackbarMessage(
        "Por favor, selecciona una opción en todas las preguntas."
      );
      setSnackbarSeverity("error");
      setPreguntaActual(Object.keys(preguntasSinSeleccion)[0]);
      return;
    }

    // Iterar sobre preguntasPorSeccion
    for (const seccionId in preguntasPorSeccion) {
      const preguntas = preguntasPorSeccion[seccionId];
      const respuestasSeccion = preguntas.map((pregunta) => {
        const { id: preguntaId, tieneComentario } = pregunta;
        const { expresion, calificaciones, clasificaciones, grado } =
          respuestas[preguntaId] || {};

        const comentario = tieneComentario
          ? comentarios[preguntaId] || null
          : null;

        if (tieneComentario && !comentario) {
          setError(true);
          setSnackbarMessage(
            "Por favor, proporciona un comentario en las preguntas que lo requieran."
          );
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          throw new Error("Faltan comentarios en las preguntas requeridas.");
        }

        return {
          preguntaId,
          dependenciaId: parseInt(dependencia),
          respuestaText:
            expresion || calificaciones || clasificaciones || grado,
          comentario,
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
      redirectTimer.current = setTimeout(() => {
        history.push("/inicio");
      }, 2000);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        "Su formulario no pudo ser enviado. Faltan respuestas."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <Container>
      <Typography variant="h4" className={classes.tituloPregunta}>
        {mensaje}
        {seccionId &&
          secciones.length > 0 &&
          secciones.find((seccion) => seccion.id === seccionId)?.descripcion}
      </Typography>
      <Divider />
      <form onSubmit={enviarRespuestas} className="formulario">
        {error && (
          <Typography variant="body1" color="error">
            Por favor, selecciona una opción en todas las preguntas.
          </Typography>
        )}
        {preguntasSinSeleccion && (
          <Typography variant="body1" color="error"></Typography>
        )}
        {isFirstPage && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={6} key={pregunta.id}>
              <ListItem style={{ height: "100%" }}>
                <Box
                  className={classes.pregunta}
                  display="flex"
                  flexDirection="column"
                  boxShadow={6}
                  borderRadius={5}
                  p={2}
                  mb={2}
                  width={"100%"}
                  value={pregunta.id}
                >
                  <Typography>
                    <Box sx={{ fontSize: 18, paddingTop: "1%" }}>
                      {pregunta.descripcion}
                    </Box>
                  </Typography>
                  <br />
                  <Grid container spacing={2}>
                    {pregunta.tipoPregunta && tipoRespuesta && (
                      <>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id={`respuesta-${pregunta.id}-label`}>
                              ¿Qué opinas?
                            </InputLabel>
                            <Select
                              name="tipoRespuesta"
                              value={
                                respuestas[pregunta.id]?.tipoRespuesta || ""
                              }
                              onChange={(event) => {
                                const { value } = event.target;
                                setRespuestas((prevRespuestas) => ({
                                  ...prevRespuestas,
                                  [pregunta.id]: {
                                    ...prevRespuestas[pregunta.id],
                                    tipoRespuesta: value,
                                  },
                                }));
                              }}
                              label="tipoRespuesta"
                              required
                            >
                              {pregunta.tipoPregunta.map((tipoPreguntaId) => {
                                const tipo = tipoRespuesta[tipoPreguntaId];
                                return (
                                  <MenuItem key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        {pregunta.tieneComentario && (
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel htmlFor={`comentario-${pregunta.id}`}>
                                {pregunta.descripcionComentario}
                              </InputLabel>
                              <TextField
                                id={`comentario-${pregunta.id}`}
                                name={`comentario-${pregunta.id}`}
                                value={comentarios[pregunta.id] || ""}
                                onChange={(event) =>
                                  handleComentarioChange(event, pregunta.id)
                                }
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
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
        className="pagination"
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
