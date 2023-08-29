import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";

const CrearTipoRespuesta = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [tipoPreguntaDescripcion, setTipoPreguntaDescripcion] = useState("");
  const [tipoRespuestaDescripcion, setTipoRespuestaDescripcion] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [dependenciaId, setDependenciaId] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [alertaSeccionExistente, setAlertaSeccionExistente] = useState(false);
  const [alertaClaveExistente, setAlertaClaveExistente] = useState(false);
  const [tipoPreguntaId, setTipoPreguntaId] = useState("");
  const [tipoRespuestaId, setTipoRespuestaId] = useState("");
  const [tipoPregunta, setTipoPregunta] = useState("");
  const [tipoPreguntas, setTipoPreguntas] = useState([]);
  const [tipoRespuesta, setTipoRespuesta] = useState("");
  const [alertaInicioExistente, setAlertaInicioExistente] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioNombre, setFormularioNombre] = useState("");
  const [dependenciasSeleccionadas, setDependenciasSeleccionadas] = useState(
    []
  );
  const [formularioId, setFormularioId] = useState("");

  useEffect(() => {
    fetchDependencias();
    fetchFormulario();
    fetchTipoPreguntas();
  }, []);

  useEffect(() => {
    if (dependencias.length > 0 && dependenciaId) {
      const dependencia = dependencias.find((dep) => dep.id === dependenciaId);
      if (dependencia && dependencia.clave) {
        setAlertaClaveExistente(true);
      }
    }
  }, [dependencias, dependenciaId]);

  const fetchDependencias = () => {
    fetch("http://localhost:4000/dependencias")
      .then((response) => response.json())
      .then((data) => {
        const dependenciasOrdenadas = data.sort((a, b) =>
          a.nombreDependencia.localeCompare(b.nombreDependencia)
        );
        setDependencias(dependenciasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  const fetchTipoPreguntas = () => {
    fetch("http://localhost:4000/tipoPregunta")
      .then((response) => response.json())
      .then((data) => {
        setTipoPreguntas(data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de pregunta:", error);
      });
  };

  const fetchFormulario = () => {
    fetch("http://localhost:4000/formulario")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching formularios");
        }
        return response.json();
      })
      .then((data) => {
        const formulariosObj = {};
        data.forEach((formulario) => {
          formulariosObj[formulario.id] = formulario;
        });
        setFormularios(formulariosObj);
      })
      .catch((error) => {
        console.log("Error fetching formularios:", error);
      });
  };

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
  };


  const handleTipoPreguntaChange = (event) => {
    setTipoPreguntaId(event.target.value);
  };

  const handleTipoPreguntaSubmit = (event) => {
    event.preventDefault();
    crearTipoPregunta(tipoPreguntaDescripcion, formularioId);
    setSeccionDescripcion("");
  };

  const crearTipoPregunta = (descripcion, formularioId) => {
    fetch("http://localhost:4000/tipoPregunta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: descripcion,
        formularioId: formularioId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Tipo Pregunta creada:", descripcion);
          setTipoPreguntaDescripcion("");
        } else {
          throw new Error("Error al crear el Tipo de Pregunta.");
        }
      })
      .catch((error) => {
        console.error(error);
       // setErrorSeccion(true);
      });
  };

  const handleTipoRespuestaSubmit = (event) => {
    event.preventDefault();
    crearTipoRespuesta(tipoRespuestaDescripcion, tipoPreguntaId, formularioId);
    setTipoRespuestaDescripcion("");
  };

  const crearTipoRespuesta = (descripcion, tipoPreguntaId, formularioId) => {
    fetch("http://localhost:4000/tipoRespuesta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: descripcion,
        tipoPreguntaId: tipoPreguntaId,
        formularioId: formularioId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Tipo Respuesta creada:", descripcion);
          setTipoRespuestaDescripcion("");
        } else {
          throw new Error("Error al crear el Tipo de Respuesta.");
        }
      })
      .catch((error) => {
        console.error(error);
        //setErrorTipoRespuesta(true);
      });
  };

  return (
  <div className={`${classes.divMain} 'mb80px'`} style={{ display: "flex" }}>
             <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={7}
            mb={7}
          >
            <form onSubmit={handleTipoRespuestaSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR TIPO RESPUESTA</p>
              <TextField
                className={classes.textField}
                label="Descripción"
                value={tipoRespuestaDescripcion}
                onChange={(event) =>
                  setTipoRespuestaDescripcion(event.target.value)
                }
              />

              <FormControl className={classes.textField}>
                <InputLabel id="tipo-pregunta-select-label">
                  Tipo de Pregunta
                </InputLabel>
                <Select
                  value={tipoPreguntaId}
                  onChange={handleTipoPreguntaChange}
                >
                  {tipoPreguntas.map((tipoPregunta) => (
                    <MenuItem key={tipoPregunta.id} value={tipoPregunta.id}>
                      {tipoPregunta.descripcion}
                    </MenuItem>
                  ))}
                </Select>
                <Select value={formularioId} onChange={handleFormularioChange}>
                  {Object.values(formularios).map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.id}>
                      {formulario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Crear TIPO RESPUESTA
              </Button>
            </form>
          </Box>
  </div>
    );
};

export default CrearTipoRespuesta;
