import React, { useState, useEffect } from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';

const Estadisticas = () => {
  const [dependencias, setDependencias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [selectedDependencia, setSelectedDependencia] = useState('');
  const [selectedPregunta, setSelectedPregunta] = useState('');

  const [respuestaData, setRespuestaData] = useState(null);
  const [edadData, setEdadData] = useState(null);
  const [generoData, setGeneroData] = useState(null);
  const [clasificacionData, setClasificacionData] = useState(null);
  const [calificacionData, setCalificacionData] = useState(null);

  useEffect(() => {
    const fetchDependencias = async () => {
      try {
        const response = await fetch('/api/dependencias');
        const data = await response.json();
        setDependencias(data);
      } catch (error) {
        console.error('Error al obtener las dependencias:', error);
      }
    };

    fetchDependencias();
  }, []);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        if (selectedDependencia) {
          const response = await fetch(`/api/preguntas?dependenciaId=${selectedDependencia}`);
          const data = await response.json();
          setPreguntas(data);
        } else {
          setPreguntas([]);
        }
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    };

    fetchPreguntas();
  }, [selectedDependencia]);

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const response = await fetch(`/api/respuestas?dependenciaId=${selectedDependencia}&preguntaId=${selectedPregunta}`);
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
        });

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

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
  };

  return (
    <div>
      <FormControl>
        <InputLabel>Dependencia</InputLabel>
        <Select value={selectedDependencia} onChange={handleDependenciaChange}>
          {dependencias.map((dependencia) => (
            <MenuItem key={dependencia.id} value={dependencia.id}>
              {dependencia.nombreDependencia}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl>
        <InputLabel>Pregunta</InputLabel>
        <Select value={selectedPregunta} onChange={handlePreguntaChange}>
          {preguntas.map((pregunta) => (
            <MenuItem key={pregunta.id} value={pregunta.id}>
              {pregunta.descripcion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {respuestaData && (
        <div>
          <Typography variant="h6">Respuestas</Typography>
          <Bar data={respuestaData} options={{ responsive: true }} />
        </div>
      )}

      {edadData && (
        <div>
          <Typography variant="h6">Edad</Typography>
          <Pie data={edadData} options={{ responsive: true }} />
        </div>
      )}

      {generoData && (
        <div>
          <Typography variant="h6">Género</Typography>
          <Doughnut data={generoData} options={{ responsive: true }} />
        </div>
      )}

      {clasificacionData && (
        <div>
          <Typography variant="h6">Clasificación</Typography>
          <PolarArea data={clasificacionData} options={{ responsive: true }} />
        </div>
      )}

      {calificacionData && (
        <div>
          <Typography variant="h6">Calificación</Typography>
          <Bar data={calificacionData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default Estadisticas;
