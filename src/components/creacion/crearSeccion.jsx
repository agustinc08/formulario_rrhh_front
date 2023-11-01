import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";
import API_BASE_URL from "../../config"

const CrearSeccion = () => {
  const classes = useStyles();
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [errorSeccion, setErrorSeccion] = useState(false);
  const [alertaSeccion, setAlertaSeccion] = useState(false);
  const [alertaSeccionExistente, setAlertaSeccionExistente] = useState(false);
  const [formularioId, setFormularioId] = useState("");

  useEffect(() => {
    fetchFormulario();
  }, []);

  const fetchFormulario = () => {
    fetch(`${API_BASE_URL}/formulario`)
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

  const handleCloseAlert = () => {
    // Cerrar la alerta después de 1 segundo
    setTimeout(() => {
      setAlertaSeccion(false);
      setAlertaSeccionExistente(false);
    }, 1000); // 1000 milisegundos = 1 segundo
  };

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
  };

  const handleSeccionSubmit = (event) => {
    event.preventDefault();
    if (seccionDescripcion.trim() === "") {
      setErrorSeccion(true);
      return;
    }

    const existeSeccionEnFormulario = secciones.some(
      (seccion) =>
        seccion.descripcion.toLowerCase() ===
          seccionDescripcion.trim().toLowerCase() &&
        seccion.formularioId === formularioId
    );

    if (existeSeccionEnFormulario) {
      setErrorSeccion(true);
      setAlertaSeccion(true);
      setAlertaSeccionExistente(true);
      return;
    }

    crearSeccion(seccionDescripcion, formularioId);
    setSeccionDescripcion("");
  };

  const crearSeccion = (descripcion, formularioId) => {
    fetch(`${API_BASE_URL}/secciones`, {
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
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setErrorSeccion(true);
          setAlertaSeccion(false);
          setAlertaSeccionExistente(true);
          throw new Error("Error al crear la sección.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorSeccion(true);
      });
  };

  return (
    <Box
      className={`${classes.boxForm} ${classes.boxIzquierdo} `}
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
            Ya existe una Seccion con el mismo nombre en este formulario,
            intentelo denuevo.
            <CloseIcon fontSize="inherit" onClick={handleCloseAlert} />
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default CrearSeccion;
