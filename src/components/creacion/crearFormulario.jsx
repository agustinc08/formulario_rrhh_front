import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";
import API_BASE_URL from "../../config"

const CrearFormulario = () => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [alertaFormulario, setAlertaFormulario] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioNombre, setFormularioNombre] = useState("");
  const [dependenciasSeleccionadas, setDependenciasSeleccionadas] = useState(
    []
  );
  const [isInputEmpty, setIsInputEmpty] = useState(true); // Nuevo estado

  const handleFormularioSubmit = (event) => {
    event.preventDefault();
    if (formularioNombre.trim() === "") {
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
    const dependencias = formularioData.dependencias.map((dependencia) => ({
      id: dependencia.id,
    }));

    const formularioCreateData = {
      nombre: formularioData.nombre,
      dependencias: {
        connect: dependencias,
      },
    };

    fetch(`${API_BASE_URL}/formulario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formularioCreateData),
    })
      .then((response) => {
        if (response.ok) {
          setAlertaCreacionExitosa(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setAlertaFormulario(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setFormularioNombre(inputValue);
    setIsInputEmpty(inputValue.trim() === ""); // Actualiza isInputEmpty
  };

  return (
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
          onChange={handleInputChange} // Usa la nueva función de manejo de cambio
        />

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
          disabled={isInputEmpty} // Habilita o deshabilita el botón
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
          <Alert severity="error" onClose={() => setAlertaFormulario(false)}>
            Error al crear el formulario, ya hay un formulario con el mismo nombre.
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default CrearFormulario;
