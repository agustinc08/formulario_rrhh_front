import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import { Box } from "@material-ui/core";
import "../css/global.css";
import "../css/creacion.css";
import useStyles from "../styles/creacionStyle";

const Creaciones = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [tipoPreguntaDescripcion, setTipoPreguntaDescripcion] = useState("");
  const [tipoRespuestaDescripcion, setTipoRespuestaDescripcion] = useState("");
  const [tieneComentario, setTieneComentario] = useState(false);
  const [descripcionComentario, setDescripcionComentario] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [dependenciaId, setDependenciaId] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [seccionId, setSeccionId] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [errorSeccion, setErrorSeccion] = useState(false);
  const [errorTipoPregunta, setErrorTipoPregunta] = useState(false);
  const [errorTipoRespuesta, setErrorTipoRespuesta] = useState(false);
  const [errorPregunta, setErrorPregunta] = useState(false);
  const [alertaDependencia, setAlertaDependencia] = useState(false);
  const [alertaSeccion, setAlertaSeccion] = useState(false);
  const [alertaPregunta, setAlertaPregunta] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [showAlert, setShowAlert] = useState(true);
  const [alertaSeccionExistente, setAlertaSeccionExistente] = useState(false);
  const [alertaClaveExistente, setAlertaClaveExistente] = useState(false);
  const [alertaFormulario, setAlertaFormulario] = useState(false);
  const [tituloPrincipal, setTituloPrincipal] = useState("");
  const [introduccionDescripcion, setIntroduccionDescripcion] = useState("");
  const [objetivoDescripcion, setObjetivoDescripcion] = useState("");
  const [parrafo, setParrafo] = useState("");
  const [errorTituloPrincipal, setErrorTituloPrincipal] = useState(false);
  const [errorIntroduccionDescripcion, setErrorIntroduccionDescripcion] =
    useState(false);
  const [errorObjetivoDescripcion, setErrorObjetivoDescripcion] =
    useState(false);
  const [tipoPreguntaId, setTipoPreguntaId] = useState("");
  const [errorParrafo, setErrorParrafo] = useState(false);
  const [alertaInicio, setAlertaInicio] = useState(false);
  const [inicioCreado, setInicioCreado] = useState(false);
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
    fetch("http://localhost:3000/dependencias")
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
    fetch("http://localhost:3000/tipoPregunta")
      .then((response) => response.json())
      .then((data) => {
        setTipoPreguntas(data); // Guardar los tipos de pregunta en el estado
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de pregunta:", error);
      });
  };

  const fetchFormulario = () => {
    fetch("http://localhost:3000/formulario")
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

  const verificarInicioCreado = () => {
    fetch(`http://localhost:3000/inicio?formularioId=${formularioId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de inicio");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          // Mostrar alerta de error si ya existe un inicio para el formulario actual
          setAlertaInicioExistente(true);
        } else {
          // Crear el inicio si no hay ningún inicio creado para el formulario actual
          crearInicio({
            formularioId: formularioId,
            tituloPrincipal: tituloPrincipal,
            introduccionDescripcion: introduccionDescripcion,
            objetivoDescripcion: objetivoDescripcion,
            parrafo: parrafo,
          });
        }
      })
      .catch((error) => {
        console.error("Error al verificar el inicio creado:", error);
      });
  };
  const handleComentarioCheckboxChange = (event) => {
    setTieneComentario(event.target.checked);
  };

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
  };

  const handleTipoPreguntaChange = (event) => {
    setTipoPreguntaId(event.target.value);
  };

  const handleFormularioSubmit = (event) => {
    event.preventDefault();

    // Verifica si el nombre del formulario está vacío
    if (formularioNombre.trim() === "") {
      // Realiza alguna acción, como mostrar un mensaje de error
      return;
    }

    crearFormulario({
      nombre: formularioNombre,
      dependencias: dependencias,
    });

    setFormularioNombre("");
    setDependenciasSeleccionadas([]);
  };

  const crearFormulario = (formularioData) => {
    const dependencias = formularioData.dependencias.map(
      (dependencia) => dependencia.id
    );

    const formularioCreateData = {
      nombre: formularioData.nombre,
      dependencias: {
        connect: dependencias,
      },
    };

    fetch("http://localhost:3000/formulario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formularioCreateData),
    })
      .then((response) => {
        if (response.ok) {
          setAlertaCreacionExitosa(true);
        } else {
          setAlertaFormulario(true);
        }
      })
      .catch((error) => {
        // Maneja el error en caso de que ocurra
      });
  };

  const handleSeccionSubmit = (event) => {
    event.preventDefault();
    if (seccionDescripcion.trim() === "") {
      setErrorSeccion(true);
      return;
    }

    // Verificar si ya existe una sección con el mismo nombre
    const existeSeccion = secciones.some(
      (seccion) =>
        seccion.descripcion.toLowerCase() ===
        seccionDescripcion.trim().toLowerCase()
    );

    if (existeSeccion) {
      setErrorSeccion(true);
      setAlertaSeccion(false); // Desactivar la alerta si ya existe una sección con el mismo nombre
      setAlertaSeccionExistente(true); // Activar la alerta de sección existente
      return;
    }

    crearSeccion(seccionDescripcion, formularioId);
    setSeccionDescripcion("");
  };

  const handleCloseAlert = () => {
    setAlertaDependencia(false);

    setAlertaSeccion(false);
    setAlertaPregunta(false);
    setShowAlert(false);
  };

  const crearSeccion = (descripcion, formularioId) => {
    fetch("http://localhost:3000/secciones", {
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
          console.log("Sección creada:", descripcion);
          setAlertaSeccion(true);
          setSeccionDescripcion("");
          setErrorSeccion(false);
          setAlertaSeccionExistente(false);
        } else {
          throw new Error("Error al crear la sección.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorSeccion(true);
      });
  };

  const handleTipoPreguntaSubmit = (event) => {
    event.preventDefault();

    crearTipoPregunta(tipoPreguntaDescripcion, formularioId);
    setSeccionDescripcion("");
  };

  const crearTipoPregunta = (descripcion, formularioId) => {
    fetch("http://localhost:3000/tipoPregunta", {
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
          setTipoPreguntaDescripcion();
        } else {
          throw new Error("Error al crear el Tipo de Pregunta.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorSeccion(true);
      });
  };

  const handleTipoRespuestaSubmit = (event) => {
    event.preventDefault();

    crearTipoRespuesta(tipoRespuestaDescripcion, tipoPreguntaId, formularioId);
    setTipoRespuestaDescripcion("");
  };

  const crearTipoRespuesta = (descripcion, tipoPreguntaId, formularioId) => {
    fetch("http://localhost:3000/tipoRespuesta", {
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
        setErrorTipoRespuesta(true);
      });
  };

  const handlePreguntaSubmit = (event) => {
    event.preventDefault();
    if (pregunta.trim() === "") {
      setErrorPregunta(true);
      return;
    }
    if (!seccionId) {
      setErrorPregunta(true);
      setErrorSeccion(true);
      return;
    }

    crearPregunta({
      descripcion: pregunta,
      seccionId: seccionId,
      tieneComentario: tieneComentario,
      descripcionComentario: descripcionComentario,
      tipoPregunta: tipoPregunta, // Agregar tipoPregunta al objeto de datos
      tipoRespuesta: tipoRespuesta, // Agregar tipoRespuesta al objeto de datos
    });

    // Reiniciar los campos después de enviar el formulario
    setPregunta("");
    setSeccionId("");
    setTieneComentario(false);
    setDescripcionComentario("");
  };

  const crearPregunta = ({
    descripcion,
    seccionId,
    tieneComentario,
    descripcionComentario,
    tipoPregunta,
    tipoRespuesta,
  }) => {
    fetch("http://localhost:3000/preguntas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formularioId: formularioId,
        descripcion: descripcion,
        seccionId: seccionId,
        tieneComentario: tieneComentario,
        descripcionComentario: descripcionComentario,
        tipoPregunta: tipoPregunta, // Agregar tipoPregunta al objeto de datos
        tipoRespuesta: tipoRespuesta, // Agregar tipoRespuesta al objeto de datos
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Pregunta creada:", descripcion);
          setAlertaPregunta(true);
          setPregunta("");
          setSeccionId("");
          setErrorPregunta(false);
          //window.location.reload();
        } else {
          throw new Error("Error al crear la pregunta.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorPregunta(true);
      });
  };

  const handleInicioSubmit = (event) => {
    event.preventDefault();
    if (tituloPrincipal.trim() === "") {
      setErrorTituloPrincipal(true);
      return;
    }
    if (introduccionDescripcion.trim() === "") {
      setErrorIntroduccionDescripcion(true);
      return;
    }
    if (objetivoDescripcion.trim() === "") {
      setErrorObjetivoDescripcion(true);
      return;
    }
    if (parrafo.trim() === "") {
      setErrorParrafo(true);
      return;
    }

    verificarInicioCreado();
  };

  const crearInicio = ({
    formularioId,
    tituloPrincipal,
    introduccionDescripcion,
    objetivoDescripcion,
    parrafo,
  }) => {
    if (!formularioId) {
      // Mostrar un mensaje de error o manejar el caso cuando no se proporciona formularioId
      console.error("El formularioId no se ha proporcionado");
      return;
    }

    fetch("http://localhost:3000/inicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formularioId: formularioId,
        tituloPrincipal: tituloPrincipal,
        introduccionDescripcion: introduccionDescripcion,
        objetivoDescripcion: objetivoDescripcion,
        parrafo: parrafo,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Inicio creado:", tituloPrincipal);
          setAlertaInicio(true);
          setTituloPrincipal("");
          setIntroduccionDescripcion("");
          setObjetivoDescripcion("");
          setParrafo("");
          setErrorTituloPrincipal(false);
          setErrorIntroduccionDescripcion(false);
          setErrorObjetivoDescripcion(false);
          setErrorParrafo(false);
          setInicioCreado(true);
          setAlertaCreacionExitosa(true);
          //window.location.reload();
        } else {
          throw new Error("Error al crear el inicio.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className={classes.divMain} style={{ display: "flex" }}>
      <Grid container spacing={6} className={classes.gridPrincipal}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={`${classes.cardCreacion} ${classes.gridIzquierdo}`}
        >
          <Box
            className={`${classes.boxForm} ${classes.boxIzquierdo}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleFormularioSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR FORMULARIO</p>
              <TextField
                className={classes.textField}
                label="Nombre del formulario"
                value={formularioNombre}
                onChange={(event) => setFormularioNombre(event.target.value)}
              />
              <FormControl className={classes.textField}>
                <InputLabel id="dependencias-label">Dependencias</InputLabel>
                <Select
                  labelId="dependencias-label"
                  multiple
                  value={dependenciasSeleccionadas}
                  onChange={(event) =>
                    setDependenciasSeleccionadas(event.target.value)
                  }
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
                      <Checkbox
                        checked={dependenciasSeleccionadas.includes(
                          dependencia.nombreDependencia
                        )}
                      />
                      <ListItemText primary={dependencia.nombreDependencia} />
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
                Crear formulario
              </Button>

              {alertaCreacionExitosa && (
                <Alert
                  severity="success"
                  onClose={() => setAlertaCreacionExitosa(false)}
                >
                  Formulario creado exitosamente.
                </Alert>
              )}

              {alertaFormulario && (
                <Alert
                  severity="error"
                  onClose={() => setAlertaFormulario(false)}
                >
                  Error al crear el formulario.
                </Alert>
              )}
            </form>
          </Box>

          <Box
            className={`${classes.boxForm} ${classes.boxIzquierdo}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleTipoPreguntaSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR TIPO PREGUNTA</p>
              <TextField
                className={classes.textField}
                label="Descripción"
                value={tipoPreguntaDescripcion}
                onChange={(event) =>
                  setTipoPreguntaDescripcion(event.target.value)
                }
                error={errorTipoPregunta && !tipoPreguntaDescripcion.trim()}
              />

              <FormControl className={classes.textField}>
                <InputLabel id="formulario-select-label">Formulario</InputLabel>
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
                {" "}
                Crear Tipo de Pregunta{" "}
              </Button>
              {alertaSeccion && (
                <Alert severity="success">
                  ¡El tipo de Pregunta se creó correctamente!
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleCloseAlert}
                    className={classes.closeButton}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Alert>
              )}
              {alertaSeccionExistente && (
                <Alert severity="error">
                  Ya existe una Seccion con el mismo nombre, intentelo denuevo.
                </Alert>
              )}
            </form>
          </Box>

          <Box
            className={`${classes.boxForm} ${
              classes.boxIzquierdo
            } ${"boxCrearSeccion"}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleSeccionSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR SECCIÓN</p>
              <TextField
                className={classes.textField}
                label="Descripción"
                value={seccionDescripcion}
                onChange={(event) => setSeccionDescripcion(event.target.value)}
                error={errorSeccion && !seccionDescripcion.trim()}
              />

              <FormControl className={classes.textField}>
                <InputLabel id="formulario-select-label">Formulario</InputLabel>
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
                disabled={!seccionDescripcion.trim() || !formularioId}
              >
                {" "}
                Crear Sección{" "}
              </Button>
              {alertaSeccion && (
                <Alert severity="success">
                  ¡La sección se creó correctamente!
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleCloseAlert}
                    className={classes.closeButton}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Alert>
              )}
              {alertaSeccionExistente && (
                <Alert severity="error">
                  Ya existe una Seccion con el mismo nombre, intentelo denuevo.
                </Alert>
              )}
            </form>
          </Box>
        </Grid>{" "}
        {/* CIERRE GridIzquierdo */}
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={`${classes.cardCreacion} ${classes.gridDerecho}`}
        >
          <Box
            className={`${classes.boxDerecho} ${
              classes.boxForm
            } ${"boxCrearInicio"}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleInicioSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR INICIO</p>
              <TextField
                className={classes.textField}
                type="text"
                placeholder="Título principal"
                value={tituloPrincipal}
                onChange={(e) => setTituloPrincipal(e.target.value)}
              />
              <TextField
                className={classes.textField}
                type="text"
                placeholder="Descripción de introducción"
                value={introduccionDescripcion}
                onChange={(e) => setIntroduccionDescripcion(e.target.value)}
              />
              <TextField
                className={classes.textField}
                type="text"
                placeholder="Descripción de objetivo"
                value={objetivoDescripcion}
                onChange={(e) => setObjetivoDescripcion(e.target.value)}
              />
              <TextField
                className={classes.textField}
                placeholder="Párrafo"
                value={parrafo}
                onChange={(e) => setParrafo(e.target.value)}
              ></TextField>

              <FormControl className={classes.textField}>
                <InputLabel id="formulario-select-label">Formulario</InputLabel>
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
                Crear Inicio
              </Button>

              {errorTituloPrincipal && <p className={classes.error}></p>}
              {alertaCreacionExitosa && (
                <Alert
                  severity="success"
                  onClose={() => setAlertaCreacionExitosa(false)}
                >
                  Inicio creado correctamente.
                </Alert>
              )}

              {alertaInicioExistente && (
                <Alert
                  severity="error"
                  onClose={() => setAlertaInicioExistente(false)}
                >
                  Ya hay un inicio creado.
                </Alert>
              )}
            </form>
          </Box>

          <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleTipoRespuestaSubmit}>
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
                <InputLabel id="formulario-select-label">Formulario</InputLabel>
                <Select value={formularioId} onChange={handleFormularioChange}>
                  {Object.values(formularios).map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.id}>
                      {formulario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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

          <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={7}
            mb={7}
          >
            <form onSubmit={handlePreguntaSubmit} className={classes.form}>
              <p className={classes.tituloForm}>CREAR PREGUNTA</p>
              <TextField
                className={classes.textField}
                label="Pregunta"
                value={pregunta}
                onChange={(event) => setPregunta(event.target.value)}
                error={errorPregunta}
              />
              <div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tieneComentario}
                        onChange={handleComentarioCheckboxChange}
                      />
                    }
                    label="Tiene Comentario"
                  />
                </div>
              </div>

              <FormControl
                error={errorPregunta && seccionId === ""}
                className={classes.textField}
              >
                <InputLabel id="secciones-label">Sección</InputLabel>
                <Select
                  id="seccion-select"
                  value={seccionId}
                  onChange={(event) => setSeccionId(event.target.value)}
                  error={errorPregunta && seccionId === ""}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  {secciones.map((seccion) => (
                    <MenuItem key={seccion.id} value={seccion.id}>
                      {seccion.descripcion}
                    </MenuItem>
                  ))}
                </Select>

                {errorPregunta && seccionId === "" && (
                  <FormHelperText>Seleccione una sección</FormHelperText>
                )}
                {alertaSeccion && showAlert && (
                  <Alert severity="success">
                    ¡La Seccion se creó correctamente!
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleCloseAlert}
                      className={classes.closeButton}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </Alert>
                )}
              </FormControl>
              
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
              </FormControl>
              
              <FormControl
                error={errorPregunta && seccionId === ""}
                className={classes.textField}
              >
                <InputLabel id="secciones-label">Formulario</InputLabel>
                <Select value={formularioId} onChange={handleFormularioChange}>
                  {Object.values(formularios).map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.id}>
                      {formulario.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errorPregunta && seccionId === "" && (
                  <FormHelperText>Seleccione una sección</FormHelperText>
                )}
                {alertaSeccion && showAlert && (
                  <Alert severity="success">
                    ¡La Seccion se creó correctamente!
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleCloseAlert}
                      className={classes.closeButton}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </Alert>
                )}
              </FormControl>

              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Crear Pregunta
              </Button>

              {alertaPregunta && (
                <Alert severity="success">
                  ¡La pregunta se creó correctamente!
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleCloseAlert}
                    className={classes.closeButton}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Alert>
              )}
            </form>
          </Box>
        </Grid>{" "}
        {/*CIERRE GridDerecho*/}
      </Grid>{" "}
      {/*CIERRE GridPrincipal*/}
    </div>
  );
};

export default Creaciones;
