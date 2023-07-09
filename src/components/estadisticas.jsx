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
import { Bar, Pie, Doughnut, PolarArea } from "react-chartjs-2";
import useStyles from "../styles/estadisticasStyle";

const Estadisticas = () => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [selectedDependencia, setSelectedDependencia] = useState("");
  const [selectedPregunta, setSelectedPregunta] = useState("");
  const [selectedFormulario, setSelectedFormulario] = useState("");

  const [respuestas, setRespuestas] = useState([]); // Agregado
  const [formularios, setFormularios] = useState([]);

  const [expresionData, setExpresionData] = useState("");
  const [edadData, setEdadData] = useState("");
  const [generoData, setGeneroData] = useState("");
  const [clasificacionData, setClasificacionData] = useState("");
  const [calificacionData, setCalificacionData] = useState("");
  const [gradoData, setGradoData] = useState("");

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
        setDependencias(data);
        console.log("Formularios obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
      }
    };

    obtenerPreguntas();
    obtenerDependencias();
    obtenerFormularios();
  }, []);

  const fetchRespuestas = async () => {
    try {
      if (selectedDependencia !== "" && selectedPregunta !== "") {
        const response = await fetch(`http://localhost:4000/respuestas?dependenciaId=${selectedDependencia}&preguntaId=${selectedPregunta}`);
        const data = await response.json();
        setRespuestas(data); // Almacena las respuestas obtenidas en el estado

        const expresionCount = respuestas.reduce((count, respuesta) => { // Actualizado a 'respuestas' en lugar de 'data'
          const respuestaExpresion = respuesta.expresion || 'NO_SE';
          count[respuestaExpresion] = (count[respuestaExpresion] || 0) + 1;
          return count;
        }, {});

        setExpresionData({
          labels: Object.keys(expresionCount),
          datasets: [
            {
              label: 'expresion',
              data: Object.values(expresionCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
            },
          ],
        });

        const edadCount = respuestas.reduce((count, respuesta) => { // Actualizado a 'respuestas' en lugar de 'data'
          const edad = respuesta.edad;
          count[edad] = (count[edad] || 0) + 1;
          return count;
        }, {});

        setEdadData({
          labels: Object.keys(edadCount),
          datasets: [
            {
              label: 'Edad',
              data: Object.values(edadCount),
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
          ],
        });

        const generoCount = respuestas.reduce((count, respuesta) => { // Actualizado a 'respuestas' en lugar de 'data'
          const genero = respuesta.genero || 'OTRO';
          count[genero] = (count[genero] || 0) + 1;
          return count;
        }, {});

        setGeneroData({
          labels: Object.keys(generoCount),
          datasets: [
            {
              label: 'Género',
              data: Object.values(generoCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
              ],
            },
          ],
        });

        const clasificacionCount = respuestas.reduce((count, respuesta) => { // Actualizado a 'respuestas' en lugar de 'data'
          const clasificacion = respuesta.clasificaciones || 'NUNCA';
          count[clasificacion] = (count[clasificacion] || 0) + 1;
          return count;
        }, {});

        setClasificacionData({
          labels: Object.keys(clasificacionCount),
          datasets: [
            {
              label: 'Clasificación',
              data: Object.values(clasificacionCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
            },
          ],
        });

        const gradoCount = respuestas.reduce((count, respuesta) => { // Actualizado a 'respuestas' en lugar de 'data'
          const calificacion = respuesta.calificacion || 'MALO';
          count[calificacion] = (count[calificacion] || 0) + 1;
          return count;
        }, {});

        setCalificacionData({
          labels: Object.keys(gradoCount),
          datasets: [
            {
              label: 'Calificación',
              data: Object.values(gradoCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
            },
          ],
        });
      } else {
        setExpresionData(null);
        setEdadData(null);
        setGeneroData(null);
        setClasificacionData(null);
        setCalificacionData(null);
      }
    } catch (error) {
      console.error('Error fetching respuestas:', error);
    }
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
    fetchRespuestas(); // Fetch responses when pregunta changes
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
    fetchRespuestas(); // Fetch responses when dependencia changes
  };

  const handleFormularioChange = (event) => {
    setSelectedFormulario(event.target.value);
    fetchRespuestas(); // Fetch responses when dependencia changes
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
              //disabled={!selectedDependencia} // Agregar esta línea
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
               // Agregar esta línea
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
          {expresionData && (
            <div>
              <Typography variant="h6" align="center">
                Expresiones
              </Typography>
              <Bar data={expresionData} />
            </div>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {clasificacionData && (
            <div>
              <Typography variant="h6" align="center">
                Clasificación
              </Typography>
              <PolarArea data={clasificacionData} />
            </div>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {calificacionData && (
            <div>
              <Typography variant="h6" align="center">
                Calificación
              </Typography>
              <Pie data={calificacionData} />
            </div>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Box mx={3} my={5}>
          {gradoData && (
            <div>
              <Typography variant="h6" align="center">
                Grado
              </Typography>
              <Pie data={gradoData} />
            </div>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Estadisticas;
