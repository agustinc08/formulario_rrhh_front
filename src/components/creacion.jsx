import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
    width: "70% !important",
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const Creaciones = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [preguntaDescripcion, setPreguntaDescripcion] = useState("");
  const [tieneComentario, setTieneComentario] = useState(false);
  const [tieneExpresion, setTieneExpresion] = useState(false);
  const [tieneCalificaciones, setTieneCalificaciones] = useState(false);
  const [tieneClasificaciones, setTieneClasificaciones] = useState(false);
  const [tieneGrado, setTieneGrado] = useState(false);
  const [dependencias, setDependencias] = useState([]);
  const [dependenciaId, setDependenciaId] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [seccionId, setSeccionId] = useState("");
  const [clave, setClave] = useState("");
  const [dependenciaNombre, setDependenciaNombre] = useState("");
  const [errorDependencia, setErrorDependencia] = useState(false);
  const [errorClave, setErrorClave] = useState(false);
  const [errorSeccion, setErrorSeccion] = useState(false);
  const [errorPregunta, setErrorPregunta] = useState(false);
  const [alertaDependencia, setAlertaDependencia] = useState(false);
  const [alertaClave, setAlertaClave] = useState(false);
  const [alertaSeccion, setAlertaSeccion] = useState(false);
  const [alertaPregunta, setAlertaPregunta] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  useEffect(() => {
    fetchSecciones();
    fetchDependencias();
  }, []);

  const fetchSecciones = () => {
    fetch("http://localhost:3000/secciones")
      .then((response) => response.json())
      .then((data) => {
        setSecciones(data);
      })
      .catch((error) => console.log(error));
  };

  const fetchDependencias = () => {
    fetch("http://localhost:3000/dependencias")
      .then((response) => response.json())
      .then((data) => {
        // Ordenar las dependencias por nombre antes de establecer el estado
        const dependenciasOrdenadas = data.sort((a, b) =>
          a.nombreDependencia.localeCompare(b.nombreDependencia)
        );
        setDependencias(dependenciasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  const handleDependenciaSubmit = (event) => {
    event.preventDefault();
    if (dependenciaNombre.trim() === "") {
      setErrorDependencia("El nombre de la dependencia es requerido.");
      return;
    }
    crearDependencia(dependenciaNombre);
  };

  const crearDependencia = (nombre) => {
    fetch("http://localhost:3000/dependencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombreDependencia: nombre }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Dependencia creada:", nombre);
          setAlertaDependencia(true);
          setDependenciaNombre("");
          setErrorDependencia("");
        } else {
          throw new Error("Error al crear la dependencia.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorDependencia("Error al crear la dependencia. Inténtalo nuevamente.");
      });
  };
  

  const handleSeccionSubmit = (event) => {
    event.preventDefault();
    if (seccionDescripcion.trim() === "") {
      setErrorSeccion("La descripción de la sección es requerida.");
      return;
    }
    crearSeccion(seccionDescripcion);
  };

  const handleClaveSubmit = (event) => {
    event.preventDefault();
    if (clave.trim() === "") {
      setErrorClave("La clave es requerida.");
      return;
    }
    crearClave(clave);
  };

  const crearClave = (clave, dependenciaId) => {
    fetch("http://localhost:3000/claves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dependencia: { connect: { id: dependenciaId } }, clave: clave }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Clave creada:", clave);
          setAlertaClave(true);
          setClave("");
          setErrorClave("");
        } else {
          return response.json().then((data) => {
            if (data.error === 'Esta dependencia ya tiene una clave. ¿Desea actualizarla?') {
              setShowUpdateConfirmation(true);
            } else {
              throw new Error("Error al crear la clave.");
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorClave("Error al crear la clave. Inténtalo nuevamente.");
      });
  };

  // const handleUpdateConfirmation = () => {
  //   setShowUpdateConfirmation(false);
  
  //   fetch(`http://localhost:3000/claves/${dependenciaId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ clave }),
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         console.log("Clave actualizada:", clave);
  //         setAlertaClave(true);
  //         setClave("");
  //         setErrorClave("");
  //       } else {
  //         throw new Error("Error al actualizar la clave.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setErrorClave("Error al actualizar la clave. Inténtalo nuevamente.");
  //     });
  // };
  
  

  const crearSeccion = (descripcion) => {
    fetch("http://localhost:3000/secciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ descripcion: descripcion }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Sección creada:", descripcion);
          setAlertaSeccion(true);
          setSeccionDescripcion("");
          setErrorSeccion("");
        } else {
          throw new Error("Error al crear la sección.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorSeccion("Error al crear la sección. Inténtalo nuevamente.");
      });
  };

  const handlePreguntaSubmit = (event) => {
    event.preventDefault();
    if (preguntaDescripcion.trim() === "") {
      setErrorPregunta(true);
      setErrorPregunta("La descripción de la pregunta es requerida.");
      return;
    }
    if (seccionId === "") {
      setErrorSeccion(true);
      setErrorPregunta("Debe seleccionar una sección.");
      return;
    }
    crearPregunta({
      descripcion: preguntaDescripcion,
      comentario: tieneComentario,
      expresion: tieneExpresion,
      calificaciones: tieneCalificaciones,
      clasificaciones: tieneClasificaciones,
      grado: tieneGrado,
      seccion: seccionId,
    });
  };

  const crearPregunta = ({
    descripcion,
    comentario,
    expresion,
    calificaciones,
    clasificaciones,
    grado,
    seccion,
  }) => {
    // Realizar la llamada a la API para crear la pregunta usando los valores proporcionados
    console.log(
      "Crear pregunta:",
      descripcion,
      comentario,
      expresion,
      calificaciones,
      clasificaciones,
      grado,
      seccion
    );
    setAlertaPregunta(true);
    setPreguntaDescripcion("");
    setSeccionId("");
    setErrorPregunta("");
  };

  return (
    <div className={classes.container}>
      <Grid item xs={12} sm={4} lg={3}>
        <div className={classes.form}>
          <h2>Crear Dependencia</h2>

          <form onSubmit={handleDependenciaSubmit}>
            <TextField
              className={classes.textField}
              label="Dependencia"
              value={dependenciaNombre}
              onChange={(event) => setDependenciaNombre(event.target.value)}
              error={!!errorDependencia}
              helperText={errorDependencia}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Crear Dependencia
            </Button>
            {alertaDependencia && (
              <Alert severity="success">
                ¡La dependencia se creó correctamente!
              </Alert>
            )}
          </form>
        </div>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <div className={classes.form}>
          <h2>Crear Clave</h2>
          <form onSubmit={handleClaveSubmit}>
            <TextField
              className={classes.textField}
              label="Clave"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
              error={errorClave && !clave.trim()}
              helperText={errorClave}
            />
            <Select
              labelId="dependencia-select-label"
              id="dependencia-select"
              value={dependenciaId}
              onChange={(event) => setDependenciaId(event.target.value)}
            >
              {dependencias.map((dependencia) => (
                <MenuItem key={dependencia.id} value={dependencia.id}>
                  {dependencia.nombreDependencia}
                </MenuItem>
              ))}
            </Select>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Crear Clave
            </Button>
            {alertaClave && (
              <Alert severity="success">¡La clave se creó correctamente!</Alert>
            )}
          </form>
        </div>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <div className={classes.form}>
          <h2>Crear Sección</h2>
          <form onSubmit={handleSeccionSubmit}>
            <TextField
              className={classes.textField}
              label="Descripción"
              value={seccionDescripcion}
              onChange={(event) => setSeccionDescripcion(event.target.value)}
              error={errorSeccion && !seccionDescripcion.trim()}
              helperText={errorSeccion}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Crear Sección
            </Button>
            {alertaSeccion && (
              <Alert severity="success">
                ¡La sección se creó correctamente!
              </Alert>
            )}
          </form>
        </div>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <div className={classes.form}>
          <h2>Crear Pregunta</h2>
          <form onSubmit={handlePreguntaSubmit}>
            <TextField
              className={classes.textField}
              label="Pregunta"
              value={preguntaDescripcion}
              onChange={(event) => setPreguntaDescripcion(event.target.value)}
              error={errorPregunta}
              helperText={errorPregunta}
            />
            <div>
              <label>
                Tiene Comentario:
                <input
                  type="checkbox"
                  checked={tieneComentario}
                  onChange={() => setTieneComentario(!tieneComentario)}
                />
              </label>
            </div>
            <div>
              <label>
                Tiene Expresión:
                <input
                  type="checkbox"
                  checked={tieneExpresion}
                  onChange={() => setTieneExpresion(!tieneExpresion)}
                />
              </label>
            </div>
            <div>
              <label>
                Tiene Calificaciones:
                <input
                  type="checkbox"
                  checked={tieneCalificaciones}
                  onChange={() => setTieneCalificaciones(!tieneCalificaciones)}
                />
              </label>
            </div>
            <div>
              <label>
                Tiene Clasificaciones:
                <input
                  type="checkbox"
                  checked={tieneClasificaciones}
                  onChange={() =>
                    setTieneClasificaciones(!tieneClasificaciones)
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Tiene Grado:
                <input
                  type="checkbox"
                  checked={tieneGrado}
                  onChange={() => setTieneGrado(!tieneGrado)}
                />
              </label>
            </div>
            <Grid item xs={12} sm={6} lg={4}>
            <FormControl error={!!errorPregunta} className={classes.textField}>
                <InputLabel>Seleccionar Sección</InputLabel>
                <Select
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
              </FormControl>

              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Crear Pregunta
              </Button>
            </Grid>
            {alertaPregunta && (
              <Alert severity="success">
                ¡La pregunta se creó correctamente!
              </Alert>
            )}
          </form>
        </div>
      </Grid>
    </div>
  );
};

export default Creaciones;
