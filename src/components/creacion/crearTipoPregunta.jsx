import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";

const CrearTipoPregunta = () => {
  const classes = useStyles();
  const [tipoPreguntaDescripcion, setTipoPreguntaDescripcion] = useState("");
  const [errorTipoPregunta, setErrorTipoPregunta] = useState(false);
  const [alertaTipoPregunta, setAlertaPregunta] = useState(false);
  const [formularioId, setFormularioId] = useState("");

  const handleCloseAlert = () => {
    setAlertaPregunta(false);
    setErrorTipoPregunta(false);
  };

  const handleTipoPreguntaSubmit = (event) => {
    event.preventDefault();
    crearTipoPregunta(tipoPreguntaDescripcion, formularioId);
    setTipoPreguntaDescripcion("");
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
          setAlertaPregunta(true)
          setTipoPreguntaDescripcion("");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error("Error al crear el Tipo de Pregunta.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorTipoPregunta(true);
      });
  };

  return (
    <Box
        className={`${classes.boxForm} ${classes.boxIzquierdo} ${"boxCrearTipoPregunta"}`}
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
               <Button
                 className={classes.button}
                 variant="contained"
                 color="primary"
                 type="submit"
               >
                 {" "}
                 Crear Tipo de Pregunta{" "}
               </Button>
               {alertaTipoPregunta && (
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
                {errorTipoPregunta && (
            <Alert severity="error">
              Ya existe una Tipo de respuesta con el mismo nombre dentro de el mismo Tipo de pregunta ! intentelo
              nuevamente.
              <CloseIcon fontSize="inherit" onClick={handleCloseAlert} />
            </Alert>
          )}
        </form>
    </Box>

    );
};

export default CrearTipoPregunta;
