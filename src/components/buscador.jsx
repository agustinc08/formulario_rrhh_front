import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  makeStyles,
  FormControl,
  InputLabel,
  Box,
  Divider,
} from '@material-ui/core';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';
import "../components/global.css";


const useStyles = makeStyles((theme) => ({
  titulo: {
    marginTop: 20,
  },
  boton: {
    display:"flex",
    alignItems:"center"
  },
}));

const Buscador = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState('');
  const [selectedDependencia, setSelectedDependencia] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const classes = useStyles();

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

  const handleBuscarRespuestas = async () => {
    try {
      let url = 'http://localhost:3000/respuestas';
  
      const preguntaId = selectedPregunta !== undefined && selectedPregunta !== '' ? parseInt(selectedPregunta) : null;
      const dependenciaId = selectedDependencia !== undefined && selectedDependencia !== '' ? parseInt(selectedDependencia) : null;
  
      if (preguntaId && dependenciaId) {
        url += `/${preguntaId}/${dependenciaId}`;
      } else if (preguntaId) {
        url += `/pregunta/${preguntaId}`;
      } else if (dependenciaId) {
        url += `/dependencia/${dependenciaId}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
      setRespuestas(data);
      console.log('Respuestas obtenidas:', data);
    } catch (error) {
      console.error('Error al buscar respuestas:', error);
    }
  };
  
  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
    console.log('Pregunta seleccionada:', event.target.value);
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
    console.log('Dependencia seleccionada:', event.target.value);
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  // Verificar si respuestas es un array antes de recorrerlo
  const sortedRespuestas =
  Array.isArray(respuestas) && respuestas.length > 0
    ? respuestas.sort((a, b) => {
        const aValue = a[sortConfig.field] || '';
        const bValue = b[sortConfig.field] || '';

        if (sortConfig.direction === 'asc') {
          return aValue.toString().localeCompare(bValue.toString());
        } else {
          return bValue.toString().localeCompare(aValue.toString());
        }
      })
    : [];

  return (
    <div>
      <Container>
        <Box sx={{ paddingTop: 20 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ paddingTop: 40 }}>
            Buscador de Respuestas
          </Typography>
        </Box>
        <Divider></Divider>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} lg={3}>
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
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
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
          </Grid>
          <Grid item xs={12} sm={3} lg={2} className={classes.boton}>
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
        </Grid>
        </Container>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'id'}
                  direction={sortConfig.field === 'id' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'createdAt'}
                  direction={sortConfig.field === 'createdAt' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'dependenciaId'}
                  direction={sortConfig.field === 'dependenciaId' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('dependenciaId')}
                >
                  Dependencia
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'edad'}
                  direction={sortConfig.field === 'edad' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('edad')}
                >
                  Edad
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'genero'}
                  direction={sortConfig.field === 'genero' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('genero')}
                >
                  Género
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'expresion'}
                  direction={sortConfig.field === 'expresion' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('expresion')}
                >
                  Expresion
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'calificaciones'}
                  direction={sortConfig.field === 'calificaciones' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('calificaciones')}
                >
                  Calificaciones
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'clasificaciones'}
                  direction={sortConfig.field === 'clasificaciones' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('clasificaciones')}
                >
                  Clasificaciones
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'grado'}
                  direction={sortConfig.field === 'grado' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('grado')}
                >
                  Grado
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'comentarios'}
                  direction={sortConfig.field === 'comentarios' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('comentarios')}
                >
                  Comentarios
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {sortedRespuestas && sortedRespuestas.map((respuesta) => (
  <TableRow key={respuesta.id}>
    <TableCell>{respuesta.id}</TableCell>
    <TableCell>{respuesta.createdAt}</TableCell>
    <TableCell>{respuesta.dependenciaId}</TableCell>
    <TableCell>{respuesta.edad}</TableCell>
    <TableCell>{respuesta.genero}</TableCell>
    <TableCell>{respuesta.expresion}</TableCell>
    <TableCell>{respuesta.calificaciones}</TableCell>
    <TableCell>{respuesta.clasificaciones}</TableCell>
    <TableCell>{respuesta.grado}</TableCell>
    <TableCell>
      {respuesta.comentarios && respuesta.comentarios.map((comentario) => (
        <div key={comentario.id}>{comentario.comentario}</div>
      ))}
    </TableCell>
  </TableRow>
))}
          </TableBody>
        </Table>
    
    </div>
  );
};

export default Buscador;
