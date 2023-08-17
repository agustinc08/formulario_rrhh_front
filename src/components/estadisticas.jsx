import React, { useState, useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Button,
  Chip,
  Input,
  Container,
  Divider,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import useStyles from "../styles/estadisticasStyle";

const Estadisticas = () => {
  const classes = useStyles();
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [tipoRespuestaDescripciones, setTipoRespuestaDescripciones] = useState(
    {}
  );
  const [preguntaDescripciones, setPreguntaDescripciones] = useState({});
  const [dependenciaNombres, setDependenciaNombres] = useState({});
  const [selectedPregunta, setSelectedPregunta] = useState([]);
  const [selectedDependencias, setSelectedDependencias] = useState([]);
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [preguntasDelFormulario, setPreguntasDelFormulario] = useState([]);
  const [estadisticasDelFormulario, setEstadisticasDelFormulario] = useState(
    []
  );
  const [respuestasPorTipo, setRespuestasPorTipo] = useState({});
  const [estadisticasEdad, setEstadisticasEdad] = useState([]);
  const [estadisticasGenero, setEstadisticasGenero] = useState([]);
  const [estadisticasTipoRespuesta, setEstadisticasTipoRespuesta] = useState(
    []
  );
  const [respuestasData, setRespuestasData] = useState([]);

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const response = await fetch("http://localhost:4000/formulario");
        const data = await response.json();
        setFormularios(data);
        const firstActiveFormulario = data.find(
          (formulario) => formulario.estaActivo
        );
        if (firstActiveFormulario) {
          setSelectedFormulario(firstActiveFormulario.nombre);
        }
      } catch (error) {
        console.error("Error al obtener los Formularios:", error);
      }
    };

    obtenerFormularios();
  }, []);

  useEffect(() => {
    const obtenerDependencias = async () => {
      try {
        const response = await fetch("http://localhost:4000/dependencias");
        const data = await response.json();
        setDependencias(data);
        const nombres = {};
        data.forEach((dependencia) => {
          nombres[dependencia.id] = dependencia.nombreDependencia;
        });
        setDependenciaNombres(nombres);
      } catch (error) {
        console.error("Error al obtener las dependencias:", error);
      }
    };

    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:4000/preguntas");
        const data = await response.json();
        setPreguntas(data);

        const descripciones = {};
        data.forEach((pregunta) => {
          descripciones[pregunta.id] = pregunta.descripcion;
        });
        setPreguntaDescripciones(descripciones);

        const firstActiveFormulario = formularios.find((f) => f.estaActivo);
        if (firstActiveFormulario) {
          const preguntasDelFormulario = data.filter(
            (pregunta) => pregunta.formularioId === firstActiveFormulario.id
          );
          setPreguntasDelFormulario(preguntasDelFormulario);
        }
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    const obtenerTipoRespuesta = async () => {
      try {
        const response = await fetch("http://localhost:4000/tipoRespuesta");
        const data = await response.json();
        const descripciones = {};
        data.forEach((tipoRespuesta) => {
          descripciones[tipoRespuesta.id] = tipoRespuesta.descripcion;
        });
        setTipoRespuestaDescripciones(descripciones);
      } catch (error) {
        console.error("Error al obtener los tipos de respuesta:", error);
      }
    };

    obtenerDependencias();
    obtenerTipoRespuesta();
    obtenerPreguntas();
  }, [formularios]);

  const handleFormularioChange = (event) => {
    const selectedFormularioId = formularios.find(
      (f) => f.nombre === event.target.value
    )?.id;

    if (selectedFormularioId) {
      const preguntasDelFormulario = preguntas.filter(
        (pregunta) => pregunta.formularioId === selectedFormularioId
      );
      setPreguntasDelFormulario(preguntasDelFormulario);
      setSelectedFormulario(event.target.value);
    } else {
      // Si no hay formulario seleccionado, mostrar todas las preguntas
      setPreguntasDelFormulario(preguntas);
      setSelectedFormulario("");
    }
  };
  const handleDependenciaChange = (event) => {
    const selectedDependencies = event.target.value;
    setSelectedDependencias(selectedDependencies);
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
  };

  const handleBuscarRespuestas = async () => {
    try {
      const selectedDependenciaIds = selectedDependencias.map(
        (depName) =>
          dependencias.find((dep) => dep.nombreDependencia === depName)?.id
      );
      const preguntaIds = selectedPregunta.join(",");
      const dependenciaIds = selectedDependenciaIds.join(",");
      const formularioId =
        formularios.find((f) => f.nombre === selectedFormulario)?.id || "";

      if (
        selectedPregunta.length > 0 &&
        selectedDependencias.length > 0 &&
        selectedFormulario
      ) {
        // Buscar por pregunta, dependencia y formulario
        const url = `http://localhost:4000/respuestas/buscar/${preguntaIds}/${dependenciaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
        setRespuestas(data);
      } else if (
        selectedPregunta.length > 0 &&
        selectedDependencias.length > 0
      ) {
        // Buscar por pregunta y dependencia
        const url = `http://localhost:4000/respuestas/buscarpd/${preguntaIds}/${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
        setRespuestas(data);
      } else if (selectedPregunta.length > 0 && selectedFormulario !== "") {
        // Buscar por pregunta y formulario
        const url = `http://localhost:4000/respuestas/buscarpf/${preguntaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedDependencias.length > 0 && selectedFormulario !== "") {
        // Buscar por dependencia y formulario
        const url = `http://localhost:4000/respuestas/buscardf/${dependenciaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedPregunta.length > 0) {
        // Buscar por pregunta
        const url = `http://localhost:4000/respuestas/pregunta?ids=${preguntaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedDependencias.length > 0) {
        // Buscar por dependencia
        const url = `http://localhost:4000/respuestas/dependencia?ids=${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedFormulario !== "") {
        // Buscar por formulario
        const url = `http://localhost:4000/respuestas/formulario?ids=${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (
        selectedPregunta.length === 0 &&
        selectedDependencias.length === 0 &&
        selectedFormulario === ""
      ) {
        // Si ninguno de los selects está seleccionado, obtener todas las respuestas
        const response = await fetch("http://localhost:4000/respuestas");
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      }

      const estadisticasEdad = {};
      const estadisticasGenero = {};
      const estadisticasTipoRespuesta = {};

      respuestasData.forEach((respuesta) => {
        const tipoRespuestaId = respuesta.tipoRespuestaId;
        const tipoRespuestaDescripcion =
          tipoRespuestaDescripciones[tipoRespuestaId];

        if (tipoRespuestaDescripcion) {
          estadisticasTipoRespuesta[tipoRespuestaDescripcion] =
            (estadisticasTipoRespuesta[tipoRespuestaDescripcion] || 0) + 1;
        }

        const edad = respuesta.edad;
        if (edad) {
          estadisticasEdad[edad] = (estadisticasEdad[edad] || 0) + 1;
        }

        const genero = respuesta.genero;
        if (genero) {
          estadisticasGenero[genero] = (estadisticasGenero[genero] || 0) + 1;
        }
      });

      // Actualizar los estados después de procesar todas las respuestas
      setEstadisticasEdad(estadisticasEdad);
      setEstadisticasGenero(estadisticasGenero);
      setEstadisticasTipoRespuesta(estadisticasTipoRespuesta); // Mover esta línea aquí

      console.log("Respuestas Data:", respuestasData);
      console.log("Estadisticas Edad:", estadisticasEdad);
      console.log("Estadisticas Genero:", estadisticasGenero);
      console.log("Estadisticas Tipo Respuesta:", estadisticasTipoRespuesta);
      console.log("Respuestas por Tipo:", respuestasPorTipo);

      // Aquí calcula las estadísticas por tipo de respuesta y actualiza respuestasPorTipo
      const respuestasPorTipoNuevo = {};
      respuestasData.forEach((respuesta) => {
        const tipoRespuesta = respuesta.tipoRespuesta;
        if (tipoRespuesta) {
          if (!respuestasPorTipoNuevo[tipoRespuesta]) {
            respuestasPorTipoNuevo[tipoRespuesta] = [];
          }
          respuestasPorTipoNuevo[tipoRespuesta].push(respuesta);
        }
      });

      setRespuestasPorTipo(respuestasPorTipoNuevo);
    } catch (error) {
      console.error("Error al buscar respuestas: ", error);
    }
  };

  return (
    <Container>
      <Box sx={{ paddingTop: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Estadisticas
        </Typography>
      </Box>
      <Divider></Divider>
      <Grid container spacing={4} className={classes.centrar}>
        <Grid item xs={12} sm={4} lg={3}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel>Formulario</InputLabel>
            <Select
              value={selectedFormulario}
              onChange={handleFormularioChange}
              variant="standard"
              className={classes.select}
              fullWidth
            >
              <MenuItem value="">Todos los formularios</MenuItem>
              {formularios.map((formulario) => (
                <MenuItem key={formulario.id} value={formulario.nombre}>
                  {formulario.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel id="dependencias-label">Dependencias</InputLabel>
            <Select
              variant="standard"
              className={classes.select}
              fullWidth
              labelId="dependencias-label"
              multiple
              value={selectedDependencias || []}
              onChange={handleDependenciaChange}
              input={<Input />}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {dependencias.map((dependencia) => (
                <MenuItem
                  key={dependencia.id}
                  value={dependencia.nombreDependencia}
                >
                  <Chip
                    icon={
                      selectedDependencias.includes(
                        dependencia.nombreDependencia
                      ) ? (
                        <CheckIcon />
                      ) : null
                    }
                    label={dependencia.nombreDependencia}
                    className={classes.chip}
                    clickable
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel>Preguntas</InputLabel>
            <Select
              value={selectedPregunta || []}
              onChange={handlePreguntaChange}
              variant="standard"
              className={classes.select}
              fullWidth
              multiple
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={preguntaDescripciones[value]}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
            >
              {selectedFormulario === "" && (
                <MenuItem key="todas" value="">
                  Todas las preguntas
                </MenuItem>
              )}
              {preguntasDelFormulario.map((pregunta) => (
                <MenuItem key={pregunta.id} value={pregunta.id}>
                  <Chip
                    icon={
                      selectedPregunta.includes(pregunta.id) ? (
                        <CheckIcon />
                      ) : null
                    }
                    label={pregunta.descripcion}
                    className={classes.chip}
                    clickable
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3} lg={2} className={classes.centrar}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuscarRespuestas}
            fullWidth
            size="small"
          >
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mx={4} className={classes.chartContainer}>
            <Doughnut
              data={{
                labels: Object.keys(estadisticasEdad),
                datasets: [
                  {
                    label: "Edad",
                    data: Object.values(estadisticasEdad),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mx={4} className={classes.chartContainer}>
            <Bar
              data={{
                labels: Object.keys(estadisticasGenero),
                datasets: [
                  {
                    label: "Género",
                    data: Object.values(estadisticasGenero),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mx={4} className={classes.chartContainer}>
            <Pie
              data={{
                labels: Object.keys(estadisticasTipoRespuesta), // Cambio aquí
                datasets: [
                  {
                    label: "Tipo de Respuesta",
                    data: Object.values(estadisticasTipoRespuesta), // Cambio aquí
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        </Grid>
        {Object.keys(respuestasPorTipo).map((tipoRespuesta) => (
          <div key={tipoRespuesta}>
            Descripción de Tipo de Respuesta {tipoRespuesta}:{" "}
            {tipoRespuestaDescripciones[tipoRespuesta]}
          </div>
        ))}
      </Grid>
    </Container>
  );
};

export default Estadisticas;
