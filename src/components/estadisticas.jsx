import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import useStyles from '../styles/estadisticasStyle'
import BuscadorDependencias from '../components/estadisticas/buscadorDependencias'
import BuscadorPreguntas from '../components/estadisticas/buscadorPreguntas'
import BuscadorFormularios from '../components/estadisticas/buscadorFormulario'
import Graficos from '../components/estadisticas/graficos'
import API_BASE_URL from "../config"

const Estadisticas = () => {
  const classes = useStyles();
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [selectedDependencias, setSelectedDependencias] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState([]);
  const [reloadCharts, setReloadCharts] = useState(false);
  const [preguntaDescripciones, setPreguntaDescripciones] = useState([]);
  const [preguntasDelFormulario, setPreguntasDelFormulario] = useState([]);
  const [tipoRespuestaDescripciones, setTipoRespuestaDescripciones] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [dependenciaNombres, setDependenciaNombres] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [estadisticasGenero, setEstadisticasGenero] = useState([]);
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState([]);
  const [estadisticasTipoRespuesta, setEstadisticasTipoRespuesta] = useState(
    []
  );
  const [respuestasData, setRespuestasData] = useState([]);
  const [respuestasPorTipo, setRespuestasPorTipo] = useState({});
  const [estadisticasEdad, setEstadisticasEdad] = useState([]);

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/formulario`);
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
        const response = await fetch(`${API_BASE_URL}/dependencias`);
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
        const response = await fetch(`${API_BASE_URL}/preguntas`);
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
        const response = await fetch(`${API_BASE_URL}/tipoRespuesta`);
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
      setIsSearchButtonDisabled(false);
      setSelectedFormulario("");
    }
  };
  const handleDependenciaChange = (event) => {
    const selectedDependencies = event.target.value;
    setSelectedDependencias(selectedDependencies);
    setIsSearchButtonDisabled(selectedDependencias.length === 0);
  };

  const handlePreguntaChange = (event) => {
    const selectedPregunta = event.target.value;
    setSelectedPregunta(selectedPregunta);
    setIsSearchButtonDisabled(selectedPregunta.length === 0);
  };

  // Handler para la búsqueda de respuestas
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
        const url = `${API_BASE_URL}/respuestas/buscar/${preguntaIds}/${dependenciaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
        setRespuestas(data);
      } else if (
        selectedPregunta.length > 0 &&
        selectedDependencias.length > 0
      ) {
        // Buscar por pregunta y dependencia
        const url = `${API_BASE_URL}/respuestas/buscarpd/${preguntaIds}/${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
        setRespuestas(data);
      } else if (selectedPregunta.length > 0 && selectedFormulario !== "") {
        // Buscar por pregunta y formulario
        const url = `${API_BASE_URL}/respuestas/buscarpf/${preguntaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedDependencias.length > 0 && selectedFormulario !== "") {
        // Buscar por dependencia y formulario
        const url = `${API_BASE_URL}/respuestas/buscardf/${dependenciaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedPregunta.length > 0) {
        // Buscar por pregunta
        const url = `${API_BASE_URL}/respuestas/pregunta?ids=${preguntaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedDependencias.length > 0) {
        // Buscar por dependencia
        const url = `${API_BASE_URL}/respuestas/dependencia?ids=${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); // Agregar esta línea para actualizar respuestasData
      } else if (selectedFormulario !== "") {
        // Buscar por formulario
        const url = `${API_BASE_URL}/respuestas/formulario?ids=${formularioId}`;
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
        const response = await fetch(`${API_BASE_URL}/respuestas`);
        const data = await response.json();
        setRespuestas(data);
        setRespuestasData(data); 
        console.log(setRespuestasData)// Agregar esta línea para actualizar respuestasData
      }
        // Aquí usamos el callback en el setRespuestasData para asegurarnos de tener el valor actualizado
        setRespuestasData((prevRespuestasData) => {
          const estadisticasEdad = {};
          const estadisticasGenero = {};
          const estadisticasTipoRespuesta = {};
          
          prevRespuestasData.forEach((respuesta) => {
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
          setEstadisticasTipoRespuesta(estadisticasTipoRespuesta);
    
          // Aquí calcula las estadísticas por tipo de respuesta y actualiza respuestasPorTipo
          const respuestasPorTipoNuevo = {};
          prevRespuestasData.forEach((respuesta) => {
            const tipoRespuesta = respuesta.tipoRespuesta;
            if (tipoRespuesta) {
              if (!respuestasPorTipoNuevo[tipoRespuesta]) {
                respuestasPorTipoNuevo[tipoRespuesta] = [];
              }
              respuestasPorTipoNuevo[tipoRespuesta].push(respuesta);
            }
          });
          
          setRespuestasPorTipo(respuestasPorTipoNuevo);
          setReloadCharts(true);
    
          // Devolver el valor actualizado de respuestasData
          return prevRespuestasData;
        });
      } catch (error) {
        console.error("Error al buscar respuestas: ", error);
      }
    };

    return (
      <div className="divMain mb80px">
        <Container>
          <Box sx={{ paddingTop: 20 }}>
            <Typography variant="h4" align="center" gutterBottom>
             Estadisticas
            </Typography>
          </Box>
          <Divider></Divider>
          <Grid container justifyContent="center" spacing={4} className={classes.centrar}>
            <Grid item xs={12} sm={4} lg={3}>
              <BuscadorFormularios
                formularios={formularios}
                selectedFormulario={selectedFormulario}
                handleFormularioChange={handleFormularioChange}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={3}>
              <BuscadorDependencias
                dependencias={dependencias}
                selectedDependencias={selectedDependencias}
                handleDependenciaChange={handleDependenciaChange}
                disabled={!selectedFormulario}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={3}>
              <BuscadorPreguntas
                preguntasDelFormulario={preguntasDelFormulario}
                selectedPregunta={selectedPregunta}
                handlePreguntaChange={handlePreguntaChange}
                selectedFormulario={selectedFormulario}
                preguntaDescripciones={preguntaDescripciones}
                disabled={!selectedDependencias.length}
              />
            </Grid>
            <Grid item xs={12} sm={3} lg={2} px={3} className={classes.centrar}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuscarRespuestas}
                size="small"
                style={{ paddingLeft: '15px',  paddingRight: '15px'}}
                disabled={isSearchButtonDisabled}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Container>
            <Graficos
              estadisticasEdad={estadisticasEdad}
              estadisticasGenero={estadisticasGenero}
              estadisticasTipoRespuesta={estadisticasTipoRespuesta}
              tipoRespuestaDescripciones={tipoRespuestaDescripciones}
              reloadCharts={reloadCharts}
            />
      </div>
    );
  };


export default Estadisticas;
