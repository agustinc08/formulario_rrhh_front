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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
} from '@material-ui/core';
import "../components/global.css";

const useStyles = makeStyles((theme) => ({
  divMain:{
    '& h2, & .MuiListItem-root': {
      fontFamily: 'Roboto, sans-serif',
    },
    '& h2':{
      marginBottom: 0
    }
  },

  drawer: {
    width: 140,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 140,
    textAlign: "center",
  },

  gridPrincipal:{
    height: '85vh',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      margin: '0 5%',
    },
    [theme.breakpoints.up('md')]: {
      margin: '0 7%',
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0 10%',
    },
  },
  gridIzquierdo: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridDerecho: {
    display: 'flex',
    flexDirection: 'column',
  },
  boxIzquierdo: {
    flex: '1',
  },
  boxDerecho: {
    flex: '1',
  },
  boxForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    marginTop: "30px",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    margin: theme.spacing(2),
    width: "70%",
  },
  button: {
    margin: theme.spacing(2),
    width: "80%"
  },
  cardCreacion:{
    [theme.breakpoints.up('xs', 'sm' )]: {
      paddingTop: "0px !important",
    },
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
  const [preguntas, setPreguntas] = useState([]);
  const [claves, setClaves] = useState([]);
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
  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState([]);


  useEffect(() => {
    fetchSecciones();
    fetchDependencias();
    fetchPreguntas(); // Fetch 'preguntas' data
    fetchClaves(); // Fetch 'claves' data
  }, []);

  const fetchPreguntas = () => {
    fetch("http://localhost:3000/preguntas")
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
      })
      .catch((error) => console.log(error));
  };

  const fetchClaves = () => {
    fetch("http://localhost:3000/claves")
      .then((response) => response.json())
      .then((data) => {
        setClaves(data);
      })
      .catch((error) => console.log(error));
  };

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
        const dependenciasOrdenadas = data.sort((a, b) =>
          a.nombreDependencia.localeCompare(b.nombreDependencia)
        );
        setDependencias(dependenciasOrdenadas);
      })
      .catch((error) => console.log(error));
  };

  const handleOpen = (list) => {
    setSelectedList(list);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    <div className={classes.divMain} style={{display:"flex"}}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
          <ListItem button onClick={() => handleOpen("dependencias")}>
            Dependencias
          </ListItem>
          <Modal open={open && selectedList === "dependencias"} onClose={handleClose}>
            <TableContainer>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numero</TableCell>
                    <TableCell>Nombre de la Dependencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dependencias.map((dependencia) => (
                    <TableRow key={dependencia.id}>
                      <TableCell>{dependencia.id}</TableCell>
                      <TableCell>{dependencia.nombreDependencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>
          <ListItem button onClick={() => handleOpen("preguntas")}>
            Preguntas
          </ListItem>
          <Modal open={open && selectedList === "preguntas"} onClose={handleClose}>
            <TableContainer>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numero</TableCell>
                    <TableCell>Descripcion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preguntas.map((pregunta) => (
                    <TableRow key={pregunta.id}>
                      <TableCell>{pregunta.id}</TableCell>
                      <TableCell>{pregunta.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>
          <ListItem button onClick={() => handleOpen("secciones")}>
            Secciones
          </ListItem>
          <Modal open={open && selectedList === "secciones"} onClose={handleClose}>
            <TableContainer>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numero</TableCell>
                    <TableCell>Seccion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secciones.map((seccion) => (
                    <TableRow key={seccion.id}>
                      <TableCell>{seccion.id}</TableCell>
                      <TableCell>{seccion.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>
          <ListItem button onClick={() => handleOpen("claves")}>
            Claves
          </ListItem>
          <Modal open={open && selectedList === "claves"} onClose={handleClose}>
            <TableContainer>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Dependencia</TableCell>
                    <TableCell>Claves</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claves.map((clave) => (
                    <TableRow key={clave.id}>
                      <TableCell>{clave.dependencia.nombreDependencia}</TableCell>
                      <TableCell>{clave.clave}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>
        </List>
      </Drawer>


      <Grid container spacing={6} className={classes.gridPrincipal}>
        <Grid item xs={12} sm={12} md={6} className={`${classes.cardCreacion} ${classes.gridIzquierdo}`}>
            <Box className={`${classes.boxForm} ${classes.boxIzquierdo}`} boxShadow={8} borderRadius={7}>
              <form onSubmit={handleDependenciaSubmit} className={classes.form}>
                <h2>Crear Dependencia</h2>
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
            </Box>

          
            <Box className={`${classes.boxForm} ${classes.boxIzquierdo}`} boxShadow={8} borderRadius={7}>
              <form onSubmit={handleClaveSubmit} className={classes.form}>
                <h2>Crear Clave</h2>
                <TextField
                  className={classes.textField}
                  label="Clave"
                  value={clave}
                  onChange={(event) => setClave(event.target.value)}
                  error={errorClave && !clave.trim()}
                />
                <InputLabel style={{display: "flex", justifyContent: "start"}}>Dependencia</InputLabel>
                <Select
                  labelId="dependencia-select-label"
                  id="dependencia-select"
                  value={dependenciaId}
                  onChange={(event) => setDependenciaId(event.target.value)}
                  style={{width:"70%"}}
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
            </Box>
          

        </Grid>
       

        <Grid item xs={12} sm={12} md={6} className={`${classes.cardCreacion} ${classes.gridDerecho}`}>
          <Box className={`${classes.boxForm} ${classes.boxDerecho}`} boxShadow={8} borderRadius={7}>
            <form onSubmit={handleSeccionSubmit} className={classes.form}>
              <h2>Crear Sección</h2>
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
          </Box>
          <Box className={`${classes.boxForm} ${classes.boxDerecho}`} boxShadow={8} borderRadius={10} >
            <form onSubmit={handlePreguntaSubmit} className={classes.form}>
              <h2>Crear Pregunta</h2>
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
                <FormControl
                  error={errorPregunta && seccionId === ""}
                  className={classes.textField}
                >
                  <InputLabel>Sección</InputLabel>
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
              
              {alertaPregunta && (
                <Alert severity="success">
                  ¡La pregunta se creó correctamente!
                </Alert>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
      
    </div>
  );
};

export default Creaciones;
