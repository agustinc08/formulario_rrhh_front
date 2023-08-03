import React, { useState, useEffect, useCallback } from "react";
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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [error, setError] = useState(false);
  const [preguntasSinResponder, setPreguntasSinResponder] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [seccionesCompletas, setSeccionesCompletas] = useState({});
  const [activeFormularioId, setActiveFormularioId] = useState(null);
  const [userComments, setUserComments] = useState({});
  const [userCommentsBySection, setUserCommentsBySection] = useState({});

  useEffect(() => {
    async function cargarDependencias() {
      try {
        const { data } = await axios.get("http://localhost:4000/dependencias");
        setDependencias(data);
      } catch (error) {
        console.error(error);
      }
    }
    cargarDependencias();
  }, []);

  useEffect(() => {
    async function fetchTipoRespuesta() {
      try {
        const { data } = await axios.get("http://localhost:4000/tipoRespuesta");
        // Agrupar los tipos de respuesta por tipoPreguntaId
        const tipoRespuestaGrouped = data.reduce((grouped, tipo) => {
          if (grouped[tipo.tipoPreguntaId]) {
            grouped[tipo.tipoPreguntaId].push(tipo);
          } else {
            grouped[tipo.tipoPreguntaId] = [tipo];
          }
          return grouped;
        }, {});
        setTipoRespuesta(tipoRespuestaGrouped);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTipoRespuesta();
  }, []);

  const validarSeccionCompleta = useCallback(
    (seccionId) => {
      console.log("validarSeccionCompleta: check seccion completa.");

      const preguntas = preguntasPorSeccion[seccionId];
      if (!preguntas) return false;

      const preguntasSinResponder = {}; // Agregar esto para restablecer preguntasSinResponder en cada validación

      for (const pregunta of preguntas) {
        if (!pregunta) continue;
        if (!respuestas[pregunta.id]?.tipoRespuesta) {
          console.log(
            "validarSeccionCompleta: Pregunta Incompleta:",
            pregunta.id
          );
          return false;
        }
        if (
          pregunta.tieneComentario &&
          (!userComments[pregunta.id] ||
            !userComments[pregunta.id].respuestaComentario ||
            userComments[pregunta.id].respuestaComentario.trim() === "")
        ) {
          // La pregunta tiene comentario pero no se ha proporcionado
          console.log("Pregunta incompleta:", pregunta.id);
          preguntasSinResponder[pregunta.id] = true;
        } else {
          // La pregunta ha sido respondida correctamente
          preguntasSinResponder[pregunta.id] = false;
        }
      }

      setPreguntasSinResponder(preguntasSinResponder); // Actualizar el estado preguntasSinResponder
      console.log("validarSeccionCompleta: Section is complete.");
      return true;
    },
    [preguntasPorSeccion, respuestas, userComments]
  );

  useEffect(() => {
    async function getActiveFormularioId() {
      try {
        const { data } = await axios.get("http://localhost:4000/formulario");
        const formularioActivo = data.find(
          (formulario) => formulario.estaActivo
        );
        return formularioActivo ? formularioActivo.id : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async function cargarSecciones() {
      try {
        const formularioId = await getActiveFormularioId();
        if (formularioId) {
          const { data } = await axios.get(
            `http://localhost:4000/formulario/${formularioId}/secciones`
          );
          setSecciones(data);
          setSeccionId(data[0]?.id); // Establecer la primera sección como sección actual
        }
      } catch (error) {
        console.error(error);
      }
    }
    cargarSecciones();
  }, []);

  const cargarPreguntasPorSeccion = useCallback(async () => {
    try {
      for (const seccion of secciones) {
        const response = await axios.get(
          `http://localhost:4000/preguntas/${seccion.id}`
        );
        setPreguntasPorSeccion((prevPreguntasPorSeccion) => ({
          ...prevPreguntasPorSeccion,
          [seccion.id]: response.data,
        }));

        // Actualizar el estado preguntasSinResponder para la nueva sección
        const preguntasSinResponder = {};
        for (const pregunta of response.data) {
          if (
            pregunta.tieneComentario &&
            userComments[`${seccion.id}-${pregunta.id}`] &&
            typeof userComments[`${seccion.id}-${pregunta.id}`] === "string"
          ) {
            // Llamar a trim() solo si userComments[`${seccion.id}-${pregunta.id}`] es una cadena
            if (userComments[`${seccion.id}-${pregunta.id}`].trim() === "") {
              // La pregunta tiene comentario pero no se ha proporcionado
              console.log("Pregunta incompleta:", pregunta.id);
              preguntasSinResponder[`${seccion.id}-${pregunta.id}`] = true;
            } else {
              // La pregunta ha sido respondida correctamente
              preguntasSinResponder[`${seccion.id}-${pregunta.id}`] = false;
            }
          } else {
            // Si no hay comentario o no es una cadena, tratar como incompleta
            preguntasSinResponder[`${seccion.id}-${pregunta.id}`] = true;
          }
        }
        setPreguntasSinResponder(preguntasSinResponder);
        const seccionCompleta = validarSeccionCompleta(seccion.id);
        setSeccionesCompletas((prevSeccionesCompletas) => ({
          ...prevSeccionesCompletas,
          [seccion.id]: seccionCompleta,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, [secciones, userComments, validarSeccionCompleta]);

  useEffect(() => {
    cargarPreguntasPorSeccion();
  }, []);

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
  }, [seccionId, currentPage, preguntasPorSeccion]);

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
      const value = event.target.value;

    setUserComments((prevUserComments) => ({
      ...prevUserComments,
      [preguntaId]: {
        ...prevUserComments[preguntaId],
        respuestaComentario: value,
      },
    }));

    // Actualizar preguntasSinResponder para la pregunta actual
    setPreguntasSinResponder((prevPreguntasSinResponder) => ({
      ...prevPreguntasSinResponder,
      [preguntaId]: value.trim() === "",
    }));

    // Llamar a validarSeccionCompleta después de actualizar userComments
    validarSeccionCompleta(seccionId);
  }

  useEffect(() => {
    // Update the completeness status of the section
    const seccionCompleta = validarSeccionCompleta(seccionId);
    setSeccionesCompletas((prevSeccionesCompletas) => ({
      ...prevSeccionesCompletas,
      [seccionId]: seccionCompleta,
    }));
  }, [seccionId, userComments, validarSeccionCompleta]);

  async function getFormularioActivo() {
    try {
      const { data } = await axios.get("http://localhost:4000/formulario");
      const formularioActivo = data.find((formulario) => formulario.estaActivo);
      return formularioActivo ? formularioActivo.id : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function enviarRespuestas(event) {
    event.preventDefault();

    // Asegurarse de que las preguntas de la sección actual estén disponibles
    if (!preguntasPorSeccion[seccionId]) {
      await cargarPreguntasPorSeccion();
    }

    try {
      const seccionCompleta = validarSeccionCompleta(seccionId);
      if (!edad || !genero || !dependencia || !seccionCompleta) {
        setSnackbarMessage(
          "Completa todos los campos y preguntas antes de enviar el formulario"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const formularioId = await getFormularioActivo();
      if (!formularioId) {
        throw new Error("No hay formulario activo");
      }

      // Validar que todos los comentarios requeridos hayan sido respondidos
      const comentariosPendientes = preguntasPorSeccion[seccionId]?.filter(
        (pregunta) => {
          return (
            pregunta.tieneComentario &&
            (!userComments[pregunta.id]?.respuestaComentario ||
              userComments[pregunta.id].respuestaComentario.trim() === "")
          );
        }
      );

      if (comentariosPendientes.length > 0) {
        setSnackbarMessage(
          "Completa todos los comentarios antes de enviar el formulario"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const preguntasRespuestas = Object.entries(respuestas).map(
        ([preguntaId, respuesta]) => {
          const pregunta = preguntasPorSeccion[seccionId].find(
            (preg) => preg.id === parseInt(preguntaId)
          );

          // Ensure that pregunta is defined and provide a default value for tieneComentario
          const tieneComentario = pregunta?.tieneComentario || false;

          if (pregunta && pregunta.tipoRespuesta) {
            return {
              preguntaId: parseInt(preguntaId),
              formularioId,
              tipoRespuestaId: respuesta.tipoRespuesta,
              dependenciaId: dependencia,
              edad,
              genero,
              tieneComentario, // Include tieneComentario in the request payload
              comentario: {
                respuestaComentario: tieneComentario
                  ? userComments[pregunta.id]?.respuestaComentario || ""
                  : undefined,
                preguntaId: parseInt(preguntaId),
                respuestaId: respuesta.tipoRespuesta,
                formularioId,
                dependenciaId: dependencia,
              },
            };
          } else {
            return {
              preguntaId: parseInt(preguntaId),
              formularioId,
              tipoRespuestaId: respuesta.tipoRespuesta,
              dependenciaId: dependencia,
              edad,
              genero,
            };
          }
        }
      );

      console.log("Data being sent to the server:", preguntasRespuestas);

      const response = await axios.post("http://localhost:4000/respuestas", {
        preguntasRespuestas,
      });

      console.log("Data being sent to the server:", preguntasRespuestas);

      console.log("Response from the server:", response.data);

      console.log(response);

      setSnackbarMessage("Respuestas enviadas correctamente");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error al enviar las respuestas");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  }

  return (
    <Container className="mb80px">
      <Typography variant="h4" className={classes.tituloPregunta}>
        {seccionId &&
          secciones.length > 0 &&
          secciones.find((seccion) => seccion.id === seccionId)?.descripcion}
      </Typography>
      <Divider />
      <form onSubmit={enviarRespuestas} className="formulario">
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
        <Grid container spacing={2}>
          {preguntasPorSeccion[seccionId]?.map((pregunta) => (
            <Grid item xs={12} md={6} key={pregunta.id}>
              <ListItem style={{ height: "100%" }}>
                <Box
                  className={`${classes.pregunta} ${
                    preguntasSinResponder[pregunta.id]
                      ? classes.preguntaIncompleta
                      : ""
                  }`}
                  display="flex"
                  flexDirection="column"
                  boxShadow={6}
                  borderRadius={5}
                  p={2}
                  mb={2}
                  mt={4}
                  width={"100%"}
                  value={pregunta.id}
                >
                  <div className="mb20px">
                    <Typography variant="h6">{pregunta.descripcion}</Typography>
                  </div>
                  <Grid container spacing={2}>
                    {pregunta.tipoRespuesta &&
                      tipoRespuesta[pregunta.tipoPreguntaId] && (
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
                                const tipoRespuestaId = event.target.value;
                                setRespuestas((prevRespuestas) => ({
                                  ...prevRespuestas,
                                  [pregunta.id]: {
                                    ...prevRespuestas[pregunta.id],
                                    tipoRespuesta: tipoRespuestaId,
                                  },
                                }));
                              }}
                              label="tipoRespuesta"
                              required
                              className="mb20px"
                            >
                              {tipoRespuesta[pregunta.tipoPreguntaId].map(
                                (tipo) => (
                                  <MenuItem key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {pregunta.tieneComentario && (
                              <Grid item xs={12}>
                                <Typography variant="body2" className="mb20px">
                                  {pregunta.descripcionComentario}
                                </Typography>
                                <TextField
                                  label="Comentario"
                                  value={
                                    userComments[pregunta.id]
                                      ?.respuestaComentario || ""
                                  }
                                  onChange={(event) =>
                                    handleComentarioChange(event, pregunta.id)
                                  }
                                  fullWidth
                                  multiline
                                  minRows={4}
                                  variant="outlined"
                                />
                              </Grid>
                            )}
                          </FormControl>
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
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpenSnackbar(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
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
          cargarPreguntasPorSeccion(); // Agrega esta línea para cargar preguntas de la nueva sección al cambiar de página
        }}
      />
    </Container>
  );
}

export default Preguntas;
