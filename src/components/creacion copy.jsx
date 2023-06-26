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
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Paper } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
} from "@material-ui/core";
import "../css/global.css";
import "../css/creacion.css";
import useStyles from "../styles/creacionStyle";

const Creaciones = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [tieneComentario, setTieneComentario] = useState(false);
  const [descripcionComentario, setDescripcionComentario] = useState("");
  const [tieneExpresion, setTieneExpresion] = useState(false);
  const [tieneCalificaciones, setTieneCalificaciones] = useState(false);
  const [tieneClasificaciones, setTieneClasificaciones] = useState(false);
  const [tieneGrado, setTieneGrado] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [claves, setClaves] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [dependenciaId, setDependenciaId] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [seccionId, setSeccionId] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [errorSeccion, setErrorSeccion] = useState(false);
  const [errorPregunta, setErrorPregunta] = useState(false);
  const [alertaDependencia, setAlertaDependencia] = useState(false);
  const [alertaClave, setAlertaClave] = useState(false);
  const [alertaSeccion, setAlertaSeccion] = useState(false);
  const [alertaPregunta, setAlertaPregunta] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [showAlert, setShowAlert] = useState(true);
  const [alertaSeccionExistente, setAlertaSeccionExistente] = useState(false);
  const [alertaClaveExistente, setAlertaClaveExistente] = useState(false);
  const [tituloPrincipal, setTituloPrincipal] = useState("");
  const [introduccionDescripcion, setIntroduccionDescripcion] = useState("");
  const [objetivoDescripcion, setObjetivoDescripcion] = useState("");
  const [parrafo, setParrafo] = useState("");
  const [errorTituloPrincipal, setErrorTituloPrincipal] = useState(false);
  const [errorIntroduccionDescripcion, setErrorIntroduccionDescripcion] =
    useState(false);
  const [errorObjetivoDescripcion, setErrorObjetivoDescripcion] =
    useState(false);
  const [errorParrafo, setErrorParrafo] = useState(false);
  const [alertaInicio, setAlertaInicio] = useState(false);
  const [inicioCreado, setInicioCreado] = useState(false);
  const [alertaInicioExistente, setAlertaInicioExistente] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioNombre, setFormularioNombre] = useState("");
  const [dependenciasSeleccionadas, setDependenciasSeleccionadas] = useState(
    []
  );
  const [formularioId, setFormularioId] = useState("");

  useEffect(() => {
    fetchDependencias();
    fetchClaves();
    fetchFormulario();
  }, []);

  useEffect(() => {
    if (dependencias.length > 0 && dependenciaId) {
      const dependencia = dependencias.find((dep) => dep.id === dependenciaId);
      if (dependencia && dependencia.clave) {
        setAlertaClaveExistente(true);
      }
    }
  }, [dependencias, dependenciaId]);

  const fetchClaves = () => {
    fetch("http://localhost:3000/claves")
      .then((response) => response.json())
      .then((data) => {
        setClaves(data);
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

  const fetchFormulario = () => {
    fetch("http://localhost:3000/formulario")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching formularios");
        }
        return response.json();
      })
      .then((data) => {
        setFormularios(data);
      })
      .catch((error) => {
        console.log("Error fetching formularios:", error);
      });
  };

  const verificarInicioCreado = () => {
    fetch("http://localhost:3000/inicio")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Mostrar alerta de error si el inicio ya está creado
          setAlertaInicioExistente(true);
        } else {
          // Crear el inicio si no hay ningún inicio creado
          crearInicio({
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

  const handleFormularioSubmit = (event) => {
    event.preventDefault();

    // Verifica si el nombre del formulario está vacío
    if (formularioNombre.trim() === "") {
      // Realiza alguna acción, como mostrar un mensaje de error
      return;
    }

    crearFormulario({
      nombre: formularioNombre,
    });

    setFormularioNombre("");
    setDependenciasSeleccionadas([]);
  };

  const crearFormulario = (formularioData) => {
    const dependenciasData = dependenciasSeleccionadas.map(
      (nombreDependencia) => ({
        nombreDependencia,
      })
    );

    formularioData.dependencias = { create: dependenciasData };

    fetch("http://localhost:3000/formulario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formularioData),
    })
      .then((response) => {
        if (response.ok) {
          // Realiza alguna acción después de crear el formulario, como mostrar una notificación
        } else {
          // Realiza alguna acción si hubo un error en la creación del formulario
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

  const handleOpen = (list) => {
    setSelectedList(list);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAlert = () => {
    setAlertaDependencia(false);
    setAlertaClave(false);
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
      formularioId: formularioId,
      descripcion: pregunta,
      seccionId: seccionId,
      tieneComentario: tieneComentario,
      descripcionComentario: descripcionComentario,
      tieneExpresion: tieneExpresion,
      tieneCalificaciones: tieneCalificaciones,
      tieneClasificaciones: tieneClasificaciones,
      tieneGrado: tieneGrado,
    });

    // Reiniciar los campos después de enviar el formulario
    setPregunta("");
    setSeccionId("");
    setTieneComentario(false);
    setDescripcionComentario("");
    setTieneExpresion(false);
    setTieneCalificaciones(false);
    setTieneClasificaciones(false);
    setTieneGrado(false);
  };

  const crearPregunta = ({ descripcion, seccionId }) => {
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
        tieneExpresion: tieneExpresion,
        tieneCalificaciones: tieneCalificaciones,
        tieneClasificaciones: tieneClasificaciones,
        tieneGrado: tieneGrado,
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

    crearInicio({
      formularioId: formularioId,
      tituloPrincipal: tituloPrincipal,
      introduccionDescripcion: introduccionDescripcion,
      objetivoDescripcion: objetivoDescripcion,
      parrafo: parrafo,
    });

    // Reiniciar los campos después de enviar el formulario
    setTituloPrincipal("");
    setIntroduccionDescripcion("");
    setObjetivoDescripcion("");
    setParrafo("");
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
          setAlertaInicioExistente(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertaInicioExistente(true);
      });
  };

  return (
    <div className={classes.divMain} style={{ display: "flex" }}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
          <ListItem
            className="listaCreacion"
            button
            onClick={() => handleOpen("dependencias")}
          >
            Dependencias
          </ListItem>
          <Modal
            open={open && selectedList === "dependencias"}
            onClose={handleClose}
            className={classes.modal}
          >
            <Paper className={classes.modalContent}>
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
                      <TableCell>Número</TableCell>
                      <TableCell>Dependencia</TableCell>
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
            </Paper>
          </Modal>
          <ListItem
            className="listaCreacion"
            button
            onClick={() => handleOpen("preguntas")}
          >
            Preguntas
          </ListItem>
          <Modal
            open={open && selectedList === "preguntas"}
            onClose={handleClose}
            className={classes.modal}
          >
            <Paper className={classes.modalContent}>
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
                      <TableCell>Número</TableCell>
                      <TableCell>Descripción</TableCell>
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
            </Paper>
          </Modal>
          <ListItem
            className="listaCreacion"
            button
            onClick={() => handleOpen("secciones")}
          >
            Secciones
          </ListItem>
          <Modal
            open={open && selectedList === "secciones"}
            onClose={handleClose}
            className={classes.modal}
          >
            <Paper className={classes.modalContent}>
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
                      <TableCell>Número</TableCell>
                      <TableCell>Sección</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {secciones &&
                      secciones.map((seccion) => (
                        <TableRow key={seccion.id}>
                          <TableCell>{seccion.id}</TableCell>
                          <TableCell>{seccion.descripcion}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Modal>
          <ListItem
            className="listaCreacion"
            button
            onClick={() => handleOpen("claves")}
          >
            Claves
          </ListItem>
          <Modal
            open={open && selectedList === "claves"}
            onClose={handleClose}
            className={classes.modal}
          >
            <Paper className={classes.modalContent}>
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
                        <TableCell>
                          {clave.dependencia.nombreDependencia}
                        </TableCell>
                        <TableCell>{clave.clave}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Modal>
        </List>
      </Drawer>
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
            <h2>Crear Formulario</h2>
            <form onSubmit={handleFormularioSubmit}>
              <TextField
                className={classes.textField}
                label="Nombre del formulario"
                value={formularioNombre}
                onChange={(event) => setFormularioNombre(event.target.value)}
              />
              <FormControl>
                <InputLabel id="dependencias-label">Dependencias</InputLabel>
                <Select
                  className={classes.textField}
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
                <FormHelperText>Seleccione las dependencias</FormHelperText>
              </FormControl>

              <Button type="submit" variant="contained" color="primary">
                Crear formulario
              </Button>
            </form>
          </Box>

          <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleInicioSubmit} className={classes.form}>
              <h2>Crear Inicio</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.textField}
                    type="text"
                    placeholder="Título principal"
                    value={tituloPrincipal}
                    onChange={(e) => setTituloPrincipal(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.textField}
                    type="text"
                    placeholder="Descripción de introducción"
                    value={introduccionDescripcion}
                    onChange={(e) => setIntroduccionDescripcion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.textField}
                    type="text"
                    placeholder="Descripción de objetivo"
                    value={objetivoDescripcion}
                    onChange={(e) => setObjetivoDescripcion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.textField}
                    placeholder="Párrafo"
                    value={parrafo}
                    onChange={(e) => setParrafo(e.target.value)}
                  ></TextField>
                </Grid>
                <Select
                  className={classes.textField}
                  labelId="formulario-select-label"
                  id="formulario-select"
                  value={formularioId}
                  onChange={handleFormularioChange}
                  error={errorPregunta && formularioId === ""}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  {formularios.map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.id}>
                      {formulario.nombre}{" "}
                      {/* Aquí accede al nombre del formulario */}
                    </MenuItem>
                  ))}
                </Select>
                <Grid item xs={12}>
                  <button type="submit">Crear Inicio</button>
                </Grid>
              </Grid>
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
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={`${classes.cardCreacion} ${classes.gridDerecho}`}
        >
          <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={7}
          >
            <form onSubmit={handleSeccionSubmit} className={classes.form}>
              <h2>Crear Sección</h2>
              <TextField
                className={classes.textField}
                label="Descripción"
                value={seccionDescripcion}
                onChange={(event) => setSeccionDescripcion(event.target.value)}
                error={errorSeccion && !seccionDescripcion.trim()}
              />

            
              <Select
                labelId="formulario-select-label"
                className={classes.textField}
                id="formulario-select"
                value={formularioId}
                onChange={handleFormularioChange}
                error={errorPregunta && formularioId === ""}
              >
                <MenuItem value="">
                  <em>Seleccionar</em>
                </MenuItem>
                {formularios.map((formulario) => (
                  <MenuItem key={formulario.id} value={formulario.id}>
                    {formulario.nombre}{" "}
                    {/* Aquí accede al nombre del formulario */}
                  </MenuItem>
                ))}
              </Select>
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
          <Box
            className={`${classes.boxForm} ${classes.boxDerecho}`}
            boxShadow={8}
            borderRadius={10}
          >
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
                {tieneComentario && ( // Renderizar el campo de descripcionComentario solo si tieneComentario es true
                  <TextField
                    label="Descripción"
                    value={descripcionComentario}
                    onChange={(e) => setDescripcionComentario(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                )}
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tieneExpresion}
                        onChange={(event) =>
                          setTieneExpresion(event.target.checked)
                        }
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
                        onChange={(event) =>
                          setTieneCalificaciones(event.target.checked)
                        }
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
                        onChange={(event) =>
                          setTieneGrado(event.target.checked)
                        }
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
                        onChange={(event) =>
                          setTieneClasificaciones(event.target.checked)
                        }
                      />
                    }
                    label="Tiene Clasificaciones"
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

              <FormControl
                error={errorPregunta && seccionId === ""}
                className={classes.textField}
              >
                <InputLabel id="secciones-label">Sección</InputLabel>
                <Select
                  labelId="formulario-select-label"
                  id="formulario-select"
                  value={formularioId}
                  onChange={handleFormularioChange}
                  error={errorPregunta && formularioId === ""}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  {formularios.map((formulario) => (
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
        </Grid>
      </Grid>
    </div>
  );
};

export default Creaciones;
