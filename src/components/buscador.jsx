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
} from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import "../css/global.css";
import useStyles from "../styles/buscadorStyle";

const Buscador = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState("");
  const [selectedDependencia, setSelectedDependencia] = useState("");
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
  const classes = useStyles();

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:3000/preguntas");
        const data = await response.json();
        setPreguntas(data);
        console.log("Preguntas obtenidas:", data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    const obtenerDependencias = async () => {
      try {
        const response = await fetch("http://localhost:3000/dependencias");
        const data = await response.json();
        setDependencias(data);
        console.log("Dependencias obtenidas:", data);
      } catch (error) {
        console.error("Error al obtener las dependencias:", error);
      }
    };

    const obtenerFormularios = async () => {
      try {
        const response = await fetch("http://localhost:3000/formulario");
        const data = await response.json();
        setFormularios(data);
        console.log("Formularios obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener los Formularios:", error);
      }
    };

    obtenerPreguntas();
    obtenerDependencias();
    obtenerFormularios();
  }, []);

  const handleBuscarRespuestas = async () => {
    try {
      let url = "http://localhost:3000/respuestas";
  
      const preguntaId =
        selectedPregunta !== undefined && selectedPregunta !== ""
          ? parseInt(selectedPregunta)
          : null;
  
      let dependenciaId = null;
      if (selectedDependencia !== "") {
        const dependencia = dependencias.find(
          (dep) => dep.nombreDependencia === selectedDependencia
        );
        dependenciaId = dependencia ? dependencia.id : null;
      }
  
      let formularioId = null;
      if (selectedFormulario !== "") {
        const formulario = formularios.find(
          (form) => form.nombre === selectedFormulario
        );
        formularioId = formulario ? formulario.id : null;
      }
  
      if (preguntaId && dependenciaId && formularioId) {
        url += `/${preguntaId}/${dependenciaId}/${formularioId}`;
      } else if (preguntaId && dependenciaId) {
        url += `/${preguntaId}/${dependenciaId}`;
      } else if (preguntaId) {
        url += `/pregunta/${preguntaId}`;
      } else if (dependenciaId) {
        url += `/dependencia/${dependenciaId}`;
      } else if (formularioId) {
        url += `/formulario/${formularioId}`;
      }
    } catch (error) {
      console.error("Error al buscar respuestas:", error);
    }
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
    console.log("Pregunta seleccionada:", event.target.value);
  };

  const handleDependenciaChange = (event) => {
    setSelectedDependencia(event.target.value);
    console.log("Dependencia seleccionada:", event.target.value);
  };

  const handleFormularioChange = (event) => {
    setSelectedFormulario(event.target.value);
    console.log("Formulario seleccionado:", event.target.value);
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
  console.log()
  return (
    <div>
      <Container>
        <Box sx={{ paddingTop: 20 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
          >
            Buscador de Respuestas
          </Typography>
        </Box>
        <Divider></Divider>
        <Grid container spacing={4} className={classes.centrar}>
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
                {preguntas.length > 0 &&
                  preguntas.map((pregunta) => (
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
                {dependencias.length > 0 &&
                  dependencias.map((dependencia) => (
                    <MenuItem key={dependencia.id} value={dependencia.nombreDependencia}>
                      {dependencia.nombreDependencia}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
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
                {formularios.length > 0 &&
                  formularios.map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.nombre}>
                      {formulario.nombre}
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
        </Grid>
      </Container>

      <Table style={{ marginTop: "2em" }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "id"}
                direction={
                  sortConfig.field === "id" ? sortConfig.direction : "asc"
                }
                onClick={() => handleSort("id")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "createdAt"}
                direction={
                  sortConfig.field === "createdAt"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => handleSort("createdAt")}
              >
                Fecha
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "dependenciaId"}
                direction={
                  sortConfig.field === "dependenciaId"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => handleSort("dependenciaId")}
              >
                Dependencia
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "edad"}
                direction={
                  sortConfig.field === "edad" ? sortConfig.direction : "asc"
                }
                onClick={() => handleSort("edad")}
              >
                Edad
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "genero"}
                direction={
                  sortConfig.field === "genero" ? sortConfig.direction : "asc"
                }
                onClick={() => handleSort("genero")}
              >
                Género
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={
                  sortConfig.field === "expresion" ||
                  sortConfig.field === "clasificaciones" ||
                  sortConfig.field === "grado" ||
                  sortConfig.field === "calificaciones"
                }
                direction={sortConfig.direction}
                onClick={() => handleSort("expresion")}
              >
                Respuestas
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "comentarios"}
                direction={
                  sortConfig.field === "comentarios"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => handleSort("comentarios")}
              >
                Comentarios
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRespuestas.map((respuesta) => (
            <TableRow key={respuesta.id}>
              <TableCell>{respuesta.id}</TableCell>
              <TableCell>{respuesta.fechaFormateada}</TableCell>
              <TableCell>{respuesta.nombreDependencia}</TableCell>
              <TableCell>{respuesta.edadFormateada}</TableCell>
              <TableCell>{respuesta.genero}</TableCell>
              <TableCell>
                {respuesta.expresion}
                {respuesta.calificaciones}
                {respuesta.clasificaciones}
                {respuesta.grado}
              </TableCell>
              <TableCell>
                {respuesta.comentarios &&
                  respuesta.comentarios.map((comentario) => (
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
