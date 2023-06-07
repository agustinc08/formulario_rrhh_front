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
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import  FormControlLabel  from '@material-ui/core/FormControlLabel';
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "flex-start",  // Ajusta la alineación vertical según tus necesidades
    padding: theme.spacing(3),
    boxSizing: "border-box",  // Asegura que el padding esté incluido en el ancho total
    marginLeft: 140,  // Asegura que haya suficiente espacio para el ancho del drawer
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
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 140,
    textAlign: "center",
  },
}));

const Creaciones = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
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
  const [pregunta, setPregunta] = useState("");
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
      setErrorDependencia(true);
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
          setErrorDependencia(true);
          window.location.reload();
        } else {
          throw new Error("Error al crear la dependencia.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorDependencia(true);
      });
  };

  const handleSeccionSubmit = (event) => {
    event.preventDefault();
    if (seccionDescripcion.trim() === "") {
      setErrorSeccion(true);
      return;
    }
    crearSeccion(seccionDescripcion);
  };

  const handleClaveSubmit = (event) => {
    event.preventDefault();
    if (clave.trim() === "") {
      setErrorClave(true);
      return;
    }
    crearClave(clave, dependenciaId);  // Pasar dependenciaId como segundo argumento
    console.log(dependenciaId)
  };

  const crearClave = (clave, dependenciaId) => {
    fetch("http://localhost:3000/claves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dependenciaId: dependenciaId, // Pass the dependenciaId as a separate property
        clave: clave,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Clave creada:", clave);
          setAlertaClave(true);
          setClave("");
          setErrorClave(true);
          window.location.reload();
        } else {
          return response.json().then((data) => {
            if (
              data.error ===
              "Esta dependencia ya tiene una clave. ¿Desea actualizarla?"
            ) {
              setShowUpdateConfirmation(true);
            } else {
              throw new Error("Error al crear la clave.");
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorClave(true);
      });
  };

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
          setErrorSeccion(true);
          window.location.reload();
        } else {
          throw new Error("Error al crear la sección.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorSeccion(true);
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
      tieneExpresion: tieneExpresion,
      tieneCalificaciones: tieneCalificaciones,
      tieneClasificaciones: tieneClasificaciones,
      tieneGrado: tieneGrado
    });
  };

  const crearPregunta = ({
    descripcion,
    seccionId,
  }) => {
    fetch("http://localhost:3000/preguntas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: descripcion,
        seccionId: seccionId,
        tieneComentario: tieneComentario, // Pasar el valor booleano directamente
        tieneExpresion: tieneExpresion, // Pasar el valor booleano directamente
        tieneCalificaciones: tieneCalificaciones, // Pasar el valor booleano directamente
        tieneClasificaciones: tieneClasificaciones, // Pasar el valor booleano directamente
        tieneGrado: tieneGrado, // Pasar el valor booleano directamente
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Pregunta creada:", descripcion);
          setAlertaPregunta(true);
          setPregunta("");
          setSeccionId("");
          setErrorPregunta(false); // Establecer el estado de error a false
          window.location.reload();
        } else {
          throw new Error("Error al crear la pregunta.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorPregunta(true);
      });
  };

  return (
    <div>
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        <ListItem button component="a" href="http://localhost:3000/dependencias">
          Dependencias
        </ListItem>
        <ListItem button component="a" href="http://localhost:3000/preguntas">
          Preguntas
        </ListItem>
        <ListItem button component="a" href="http://localhost:3000/secciones">
          Secciones
        </ListItem>
        <ListItem button component="a" href="http://localhost:3000/claves">
          Claves
        </ListItem>
      </List>
    </Drawer>

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
              error={errorDependencia}

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
              value={pregunta}
              onChange={(event) => setPregunta(event.target.value)}
              error={errorPregunta}
            />
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tieneComentario}
                    onChange={(event) => setTieneComentario(event.target.checked)}
                  />
                }
                label="Tiene Comentario"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tieneExpresion}
                    onChange={(event) => setTieneExpresion(event.target.checked)}
                  />
                }
                label="Tiene Expresion"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tieneCalificaciones}
                    onChange={(event) => setTieneCalificaciones(event.target.checked)}
                  />
                }
                label="Tiene Calificaciones"
              />
            </div>
            <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tieneGrado}
                  onChange={(event) => setTieneGrado(event.target.checked)}
                />
              }
              label="Tiene Grado"
            />
            </div>
            <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tieneClasificaciones}
                  onChange={(event) => setTieneClasificaciones(event.target.checked)}
                />
              }
              label="Tiene Clasificaciones"
            />
            </div>
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl
                error={errorPregunta && seccionId === ""}
                className={classes.textField}
              >
                <InputLabel>Seleccionar Sección</InputLabel>
                <Select
                  labelId="seccion-select-label"
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
    </div>
  );
};

export default Creaciones;
