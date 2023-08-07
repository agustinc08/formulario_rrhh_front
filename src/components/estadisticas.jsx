import React, { useState, useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Divider,
} from "@material-ui/core";
import "../css/global.css";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import useStyles from "../styles/estadisticasStyle";

const Estadisticas = () => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [selectedDependencia, setSelectedDependencia] = useState("");
  const [selectedPregunta, setSelectedPregunta] = useState("");
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [edadData, setEdadData] = useState("");
  const [generoData, setGeneroData] = useState("");
  const [tipoRespuestaStats, setTipoRespuestaStats] = useState({});

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:4000/preguntas");
        const data = await response.json();
        setPreguntas(data);
        console.log("Preguntas obtenidas:", data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
      fetchRespuestas();
    };

    const obtenerDependencias = async () => {
      try {
        const response = await fetch("http://localhost:4000/dependencias");
        const data = await response.json();
        setDependencias(data);
        console.log("Dependencias obtenidas:", data);
      } catch (error) {
        console.error("Error al obtener las dependencias:", error);
      }
    };

    const obtenerFormularios = async () => {
      try {
        const response = await fetch("http://localhost:4000/formulario");
        const data = await response.json();
        setFormularios(data);
        console.log("Formularios obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
      }
    };

    obtenerPreguntas();
    obtenerDependencias();
    obtenerFormularios();
  }, []);

  useEffect(() => {
    fetchRespuestas();
    if (selectedFormulario !== "") {
      obtenerTiposRespuesta().catch((error) => {
        console.error("Error al obtener los tipos de respuesta:", error);
      });
    }
  }, [selectedDependencia, selectedPregunta, selectedFormulario]);

  const obtenerTiposRespuesta = async () => {
    const response = await fetch(
      `http://localhost:4000/formulario/${selectedFormulario}/tiposRespuesta`
    );
    const data = await response.json();
    // Aquí obtienes los tipos de respuesta específicos para el formulario seleccionado
    console.log("Tipos de Respuesta obtenidos:", data);
    // Actualizar el estado tipoRespuestaStats con los datos obtenidos
    setTipoRespuestaStats(data);
  };

  const fetchRespuestas = async () => {
    try {
      let url = "http://localhost:4000/respuestas";

      if (selectedDependencia !== "" && selectedPregunta !== "") {
        // Si se ha seleccionado una dependencia y una pregunta, agregar los parámetros a la URL
        url += `?dependenciaId=${selectedDependencia}&preguntaId=${selectedPregunta}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (selectedDependencia !== "" && selectedPregunta !== "") {
        // Si se ha seleccionado una dependencia y una pregunta, filtrar las respuestas
        const respuestasFiltradas = data.filter(
          (respuesta) =>
            respuesta.dependenciaId === selectedDependencia &&
            respuesta.preguntaId === selectedPregunta
        );
        setRespuestas(respuestasFiltradas);
      } else {
        // Si no se ha seleccionado una dependencia y una pregunta, mostrar todas las respuestas
        setRespuestas(data);
      }

      // Agrupar las respuestas por formulario
      const respuestasAgrupadasPorFormulario = respuestas.reduce((grouped, respuesta) => {
        const formularioId = respuesta.formularioId;
        if (!grouped[formularioId]) {
          grouped[formularioId] = [];
        }
        grouped[formularioId].push(respuesta);
        return grouped;
      }, {});

      // Contar las edades dentro de cada formulario
      const edadCountPorFormulario = {};
      Object.values(respuestasAgrupadasPorFormulario).forEach((respuestasPorFormulario) => {
        const edadCount = respuestasPorFormulario.reduce((count, respuesta) => {
          const edad = respuesta.edad;
          count[edad] = (count[edad] || 0) + 1;
          return count;
        }, {});
        edadCountPorFormulario[respuestasPorFormulario[0].formularioId] = edadCount;
      });

      // Actualizar el estado edadData con las estadísticas de edad por formulario
      setEdadData({
        labels: Object.keys(edadCountPorFormulario),
        datasets: [
          {
            label: "Edad",
            data: Object.values(edadCountPorFormulario),
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener las respuestas:", error);
    }
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
  };

  const handleFormularioChange = (event) => {
    setSelectedFormulario(event.target.value);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" className="divMain mb80px">
      <Grid item xs={12}>
        <Typography variant="h4" align="center" className={classes.titulo}>
          Estadísticas
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box mx={4}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel>Pregunta</InputLabel>
            <Select
              value={selectedPregunta}
              onChange={handlePreguntaChange}
              variant="standard"
              className={classes.select}
              fullWidth
            >
              <MenuItem value="">Todas las preguntas</MenuItem>
              {preguntas.length > 0 &&
                preguntas.map((pregunta) => (
                  <MenuItem key={pregunta.id} value={pregunta.id}>
                    {pregunta.descripcion}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box mx={4}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel>Dependencia</InputLabel>
            <Select
              value={selectedDependencia}
              onChange={handleDependenciaChange}
              variant="standard"
              className={classes.select}
              fullWidth
            >
              <MenuItem value="">Todas las dependencias</MenuItem>
              {dependencias.length > 0 &&
                dependencias.map((dependencia) => (
                  <MenuItem key={dependencia.id} value={dependencia.id}>
                    {dependencia.nombreDependencia}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box mx={4}>
          <FormControl variant="standard" fullWidth size="small">
            <InputLabel>Formulario</InputLabel>
            <Select
              value={selectedFormulario}
              onChange={handleFormularioChange}
              variant="standard"
              className={classes.select}
              fullWidth
            >
              <MenuItem value="">Todos los Formularios</MenuItem>
              {formularios.length > 0 &&
                formularios.map((formulario) => (
                  <MenuItem key={formulario.id} value={formulario.id}>
                    {formulario.nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {generoData && (
            <div>
              <Typography variant="h6" align="center">
                Género
              </Typography>
              <Doughnut data={generoData} />
            </div>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {edadData && (
            <div>
              <Typography variant="h6" align="center">
                Edad
              </Typography>
              <Pie data={edadData} />
            </div>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {Object.keys(tipoRespuestaStats).length > 0 && (
            <div>
              <Typography variant="h6" align="center">
                Estadísticas por tipo de respuesta
              </Typography>
              <Bar
                data={{
                  labels: Object.keys(tipoRespuestaStats),
                  datasets: [
                    {
                      label: "Cantidad",
                      data: Object.values(tipoRespuestaStats),
                      backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                      ],
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Estadisticas;
