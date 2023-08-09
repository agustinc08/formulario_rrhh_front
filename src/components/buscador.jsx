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
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
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
  const [tipoRespuestaDescripciones, setTipoRespuestaDescripciones] = useState(
    {}
  );
  const [preguntaDescripciones, setPreguntaDescripciones] = useState({});
  const [dependenciaNombres, setDependenciaNombres] = useState({});
  const [selectedPregunta, setSelectedPregunta] = useState([]);
  const [selectedDependencias, setSelectedDependencias] = useState([]);
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
  const classes = useStyles();

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch("http://localhost:4000/preguntas");
        const data = await response.json();
        setPreguntas(data);
        console.log("Preguntas obtenidas:", data);

        const descripciones = {};
        data.forEach((pregunta) => {
          descripciones[pregunta.id] = pregunta.descripcion;
        });
        setPreguntaDescripciones(descripciones);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    const obtenerDependencias = async () => {
      try {
        const response = await fetch("http://localhost:4000/dependencias");
        const data = await response.json();
        setDependencias(data);
        console.log("Dependencias obtenidas:", data);

        const nombres = {};
        data.forEach((dependencia) => {
          nombres[dependencia.id] = dependencia.nombreDependencia;
        });
        setDependenciaNombres(nombres);
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
    
        // Find the first active formulario
        const firstActiveFormulario = data.find((formulario) => formulario.estaActivo);
        if (firstActiveFormulario) {
          setSelectedFormulario(firstActiveFormulario.nombre);
        }
      } catch (error) {
        console.error("Error al obtener los Formularios:", error);
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

    obtenerTipoRespuesta();
    obtenerPreguntas();
    obtenerDependencias();
    obtenerFormularios();
  }, []);

  const handleBuscarRespuestas = async () => {
    try {
      let url = "http://localhost:4000/respuestas";
  
      const preguntaIds = selectedPregunta.map(Number);
      const dependenciaIds = selectedDependencias.map(
        (dependencia) =>
          dependencias.find((d) => d.nombreDependencia === dependencia)?.id
      );
  
      let queryParams = [];
  
      if (preguntaIds.length > 0) {
        queryParams.push(`preguntaIds=${preguntaIds.join(",")}`);
      }
  
      if (dependenciaIds.length > 0) {
        queryParams.push(`dependenciaIds=${dependenciaIds.join(",")}`);
      }
  
      if (selectedFormulario !== "") {
        // Find the selected formulario by its name to get the associated ID
        const selectedFormularioId = formularios.find((f) => f.nombre === selectedFormulario)?.id;
        if (selectedFormularioId) {
          queryParams.push(`formularioId=${selectedFormularioId}`);
        }
      }
  
      if (queryParams.length > 0) {
        url += "?" + queryParams.join("&");
      }
  
      console.log("URL de búsqueda:", url);
      console.log("Preguntas seleccionadas:", selectedPregunta);
      console.log("Dependencias seleccionadas:", selectedDependencias);
      console.log("Formulario seleccionado:", selectedFormulario);
  
      const response = await fetch(url);
      const data = await response.json();
      setRespuestas(data);
    } catch (error) {
      console.error("Error al buscar respuestas: ", error);
    }
  };

  const handlePreguntaChange = (event) => {
    setSelectedPregunta(event.target.value);
  };

  const handleDependenciaChange = (event) => {
    const selectedDependencies = event.target.value;
    console.log("Selected Dependencies:", selectedDependencies); // Add this line
    setSelectedDependencias(selectedDependencies);
  };

  const handleFormularioChange = (event) => {
    setSelectedFormulario(event.target.value);
    console.log("Formulario seleccionado: ", event.target.value);
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
                {preguntas.map((pregunta) => (
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

      <Table>
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
                active={sortConfig.field === "tipoRespuesta"}
                direction={
                  sortConfig.field === "tipoRespuesta"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => handleSort("tipoRespuesta.descripcion")}
              >
                Respuestas
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.field === "preguntaId"}
                direction={
                  sortConfig.field === "preguntaId"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => handleSort("preguntaId")}
              >
                Pregunta
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
              <TableCell>
                {new Date(respuesta.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {dependenciaNombres[respuesta.dependenciaId]}
              </TableCell>
              <TableCell>{respuesta.edad}</TableCell>
              <TableCell>{respuesta.genero}</TableCell>
              <TableCell>
                {tipoRespuestaDescripciones[respuesta.tipoRespuestaId]}
              </TableCell>
              <TableCell>
                {preguntaDescripciones[respuesta.preguntaId]}
              </TableCell>
              <TableCell>
                {respuesta.comentario &&
                  respuesta.comentario.respuestaComentario}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Buscador;
