import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Input,
  Chip,
  Table,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import RespuestasTable from '../components/buscador/respuestasTable'; // Asegúrate de tener la ruta correcta a tu componente RespuestasTable
import useStyles from '../styles/buscadorStyle';
import BuscadorFormularios from '../components/buscador/buscadorFormulario'
import BuscadorPreguntas from '../components/buscador/buscadorPreguntas'
import BuscadorDependencias from '../components/buscador/buscadorDependencias'

const Buscador = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [dependenciaNombres, setDependenciaNombres] = useState([]);
  const [preguntaDescripciones, setPreguntaDescripciones] = useState([]);
  const [tipoRespuestaDescripciones, setTipoRespuestaDescripciones] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState([]);
  const [selectedDependencias, setSelectedDependencias] = useState([]);
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const classes = useStyles();
  const [preguntasDelFormulario, setPreguntasDelFormulario] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });

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
    const selectedPregunta = event.target.value;
    setSelectedPregunta(selectedPregunta);
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
        setRespuestas(data);
      } else if (
        selectedPregunta.length > 0 &&
        selectedDependencias.length > 0
      ) {
        // Buscar por pregunta y dependencia
        const url = `http://localhost:4000/respuestas/buscarpd/${preguntaIds}/${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (selectedPregunta.length > 0 && selectedFormulario !== "") {
        // Buscar por pregunta y formulario
        const url = `http://localhost:4000/respuestas/buscarpf/${preguntaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (selectedDependencias.length > 0 && selectedFormulario !== "") {
        // Buscar por dependencia y formulario
        const url = `http://localhost:4000/respuestas/buscardf/${dependenciaIds}/${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (selectedPregunta.length > 0) {
        // Buscar por pregunta
        const url = `http://localhost:4000/respuestas/pregunta?ids=${preguntaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (selectedDependencias.length > 0) {
        // Buscar por dependencia
        const url = `http://localhost:4000/respuestas/dependencia?ids=${dependenciaIds}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (selectedFormulario !== "") {
        // Buscar por formulario
        const url = `http://localhost:4000/respuestas/formulario?ids=${formularioId}`;
        const response = await fetch(url);
        const data = await response.json();
        setRespuestas(data);
      } else if (
        selectedPregunta.length === 0 &&
        selectedDependencias.length === 0 &&
        selectedFormulario === ""
      ) {
        // Si ninguno de los selects está seleccionado, obtener todas las respuestas
        const response = await fetch("http://localhost:4000/respuestas");
        const data = await response.json();
        setRespuestas(data);
      }
    } catch (error) {
      console.error("Error al buscar respuestas: ", error);
    }
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortConfig.field === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ field, direction });
  };

  const sortedRespuestas =
    Array.isArray(respuestas) && respuestas.length > 0
      ? respuestas.sort((a, b) => {
          const aValue = a[sortConfig.field] || "";
          const bValue = b[sortConfig.field] || "";

          if (sortConfig.direction === "asc") {
            return aValue.toString().localeCompare(bValue.toString());
          } else {
            return bValue.toString().localeCompare(aValue.toString());
          }
        })
      : [];

      return (
        <div className="divMain mb80px">
          <Container>
            <Box sx={{ paddingTop: 20 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Buscador de Respuestas
              </Typography>
            </Box>
            <Divider></Divider>
            <Grid container spacing={4} className={classes.centrar}>
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
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <BuscadorPreguntas
                  preguntasDelFormulario={preguntasDelFormulario}
                  selectedPregunta={selectedPregunta}
                  handlePreguntaChange={handlePreguntaChange}
                  selectedFormulario={selectedFormulario}
                />
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
            </Grid>
          </Container>

          <RespuestasTable
            sortedRespuestas={sortedRespuestas}
            sortConfig={sortConfig}
            handleSort={handleSort}
            preguntas={preguntas}
            dependencias={dependencias}
            tipoRespuestaDescripciones={tipoRespuestaDescripciones} // Cambia "tiposRespuesta" a "tipoRespuestaDescripciones"
          />
        </div>
      );
    };
    
    export default Buscador;  