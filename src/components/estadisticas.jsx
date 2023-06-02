import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  makeStyles,
  Box,
} from '@material-ui/core';
import "../components/global.css";
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';


const useStyles = makeStyles((theme) => ({
  titulo: {
    marginTop: 20,
  },
}));

const Estadisticas = () => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [selectedDependencia, setSelectedDependencia] = useState('');
  const [selectedPregunta, setSelectedPregunta] = useState('');

  const [respuestaData, setRespuestaData] = useState('');
  const [edadData, setEdadData] = useState('');
  const [generoData, setGeneroData] = useState('');
  const [clasificacionData, setClasificacionData] = useState('');
  const [calificacionData, setCalificacionData] = useState('');

   useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch('http://localhost:3000/preguntas');
        const data = await response.json();
        setPreguntas(data);
        console.log('Preguntas obtenidas:', data);
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    };

    const obtenerDependencias = async () => {
      try {
        const response = await fetch('http://localhost:3000/dependencias');
        const data = await response.json();
        setDependencias(data);
        console.log('Dependencias obtenidas:', data);
      } catch (error) {
        console.error('Error al obtener las dependencias:', error);
      }
    };

    obtenerPreguntas(); 
    obtenerDependencias(); 
  }, []);

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/respuestas?dependenciaId=${selectedDependencia}&preguntaId=${selectedPregunta}`);
        const data = await response.json();

        const respuestaCount = data.reduce((count, respuesta) => {
          const respuestaExpresion = respuesta.expresion || 'NO_SE';
          count[respuestaExpresion] = (count[respuestaExpresion] || 0) + 1;
          return count;
        }, {});

        setRespuestaData({
          labels: Object.keys(respuestaCount),
          datasets: [
            {
              label: 'Respuestas',
              data: Object.values(respuestaCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
            },
          ],
        });

        const edadCount = data.reduce((count, respuesta) => {
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

        const generoCount = data.reduce((count, respuesta) => {
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

        const clasificacionCount = data.reduce((count, respuesta) => {
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
        })

        const calificacionCount = data.reduce((count, respuesta) => {
          const calificacion = respuesta.calificaciones || 'REGULAR';
          count[calificacion] = (count[calificacion] || 0) + 1;
          return count;
        }, {});

        setCalificacionData({
          labels: Object.keys(calificacionCount),
          datasets: [
            {
              label: 'Calificación',
              data: Object.values(calificacionCount),
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


      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
      }
    };

    if (selectedDependencia && selectedPregunta) {
      fetchRespuestas();
    } else {
      setRespuestaData(null);
      setEdadData(null);
      setGeneroData(null);
      setClasificacionData(null);
      setCalificacionData(null);
    }
  }, [selectedDependencia, selectedPregunta]);
  
  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
    console.log('Pregunta seleccionada:', event.target.value);
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
    console.log('Dependencia seleccionada:', event.target.value);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h4" align="center" className={classes.titulo}>
          Estadísticas
        </Typography>
        <Box m={4}>
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
                {preguntas.length > 0 && preguntas.map((pregunta) => (
                  <MenuItem key={pregunta.id} value={pregunta.id}>
                    {pregunta.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>
        <Box m={4}>
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
                {dependencias.length > 0 && dependencias.map((dependencia) => (
                  <MenuItem key={dependencia.id} value={dependencia.id}>
                    {dependencia.nombreDependencia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        {respuestaData && (
          <div>
            <Typography variant="h6" align="center">
              Respuestas
            </Typography>
            <Bar data={respuestaData} />
          </div>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        {edadData && (
          <div>
            <Typography variant="h6" align="center">
              Edad
            </Typography>
            <Pie data={edadData} />
          </div>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        {generoData && (
          <div>
            <Typography variant="h6" align="center">
              Género
            </Typography>
            <Doughnut data={generoData} />
          </div>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        {clasificacionData && (
          <div>
            <Typography variant="h6" align="center">
              Clasificación
            </Typography>
            <PolarArea data={clasificacionData} />
          </div>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        {calificacionData && (
          <div>
            <Typography variant="h6" align="center">
              Calificación
            </Typography>
            <Pie data={calificacionData} />
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default Estadisticas;
