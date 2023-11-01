import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import API_BASE_URL from "../../config"

const CrearTipoRespuesta = () => {
  const classes = useStyles();
  const [tipoRespuestaDescripcion, setTipoRespuestaDescripcion] = useState("");
  const [tipoPreguntaId, setTipoPreguntaId] = useState("");
  const [tipoPreguntas, setTipoPreguntas] = useState([]);
  const [formularioId, setFormularioId] = useState("");
  const [alertaTipoRespuesta, setAlertaTipoRespuesta] = useState("");
  const [alertaTipoRespuestaExistente, setAlertaTipoRespuestaExistente] =
    useState("");

  useEffect(() => {
    fetchTipoPreguntas();
  }, []);

  const fetchTipoPreguntas = () => {
    fetch(`${API_BASE_URL}/tipoPregunta`)
      .then((response) => response.json())
      .then((data) => {
        setTipoPreguntas(data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de pregunta:", error);
      });
  };

  const handleCloseAlert = () => {
    setAlertaTipoRespuesta(false);
    setAlertaTipoRespuestaExistente(false);
  };

  const handleTipoPreguntaChange = (event) => {
    setTipoPreguntaId(event.target.value);
  };

  const handleTipoRespuestaSubmit = (event) => {
    event.preventDefault();
    crearTipoRespuesta(tipoRespuestaDescripcion, tipoPreguntaId, formularioId);
    setTipoRespuestaDescripcion("");
  };

  const crearTipoRespuesta = (descripcion, tipoPreguntaId, formularioId) => {
    fetch(`${API_BASE_URL}/tipoRespuesta`, {
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
          setAlertaTipoRespuesta(true);
          setTipoPreguntaId("")
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error("Error al crear el Tipo de Respuesta.");
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertaTipoRespuestaExistente(true);
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
            <Select value={tipoPreguntaId} onChange={handleTipoPreguntaChange}>
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
          {alertaTipoRespuesta && (
            <Alert severity="success">
              ¡La Tipo Respuesta se creó correctamente!
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
          {alertaTipoRespuestaExistente && (
            <Alert severity="error">
              Ya existe una Tipo de respuesta con el mismo nombre dentro de el mismo Tipo de pregunta ! intentelo
              nuevamente.
              <CloseIcon fontSize="inherit" onClick={handleCloseAlert} />
            </Alert>
          )}
        </form>
      </Box>
    </div>
  );
};

export default CrearTipoRespuesta;
