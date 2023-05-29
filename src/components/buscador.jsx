import React, { useState, useEffect } from "react";
import { Container, 
  Typography, 
  Grid, 
  Select, 
  MenuItem, 
  Button, 
  List, 
  ListItem, 
  makeStyles,
  FormControl,
  InputLabel,
  Box,
  Divider
} from '@material-ui/core';
import "../components/global.css";

const useStyles = makeStyles((theme) => ({
  titulo:{
    marginTop: 20,
  },
}));

const Buscador = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState("");
  const [selectedDependencia, setSelectedDependencia] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:3000/preguntas");
        const data = await response.json();
        setPreguntas(data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    const obtenerDependencias = async () => {
      try {
        const response = await fetch("http://localhost:3000/dependencias");
        const data = await response.json();
        setDependencias(data);
      } catch (error) {
        console.error("Error al obtener las dependencias:", error);
      }
    };

    obtenerPreguntas();
    obtenerDependencias();
  }, []);

  const handleBuscarRespuestas = async () => {
    try {
      const url = `http://localhost:3000/respuestas?preguntaId=${selectedPregunta}&dependenciaId=${selectedDependencia}`;
      const response = await fetch(url);
      const data = await response.json();
      setRespuestas(data);
    } catch (error) {
      console.error("Error al buscar respuestas:", error);
    }
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
  };

  return (
    <Container>
      <Box sx={{paddingTop: 20}}>
      <Typography variant="h3" align="center" gutterBottom sx={{paddingTop: 40}}>
          Buscador de Respuestas
        </Typography>
      </Box>
      <Divider></Divider>
      <Grid container spacing={4} >
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
              <MenuItem value="">Pregunta</MenuItem>
                {preguntas.map((pregunta) => (
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
              <MenuItem value="">Dependencia</MenuItem>
                {dependencias.map((dependencia) => (
                <MenuItem key={dependencia.id} value={dependencia.id}>
                  {dependencia.nombreDependencia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
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

      <Typography variant="h5" gutterBottom className={classes.titulo}>
        Respuestas encontradas:
      </Typography>
      <List>
        {respuestas.map((respuesta) => (
          <ListItem key={respuesta.id}>{respuesta.respuesta}</ListItem>
        ))}
      </List>
    </Container>
  );
};


export default Buscador;
