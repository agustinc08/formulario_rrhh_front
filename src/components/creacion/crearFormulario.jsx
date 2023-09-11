import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";

const CrearFormulario = () => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [alertaFormulario, setAlertaFormulario] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioNombre, setFormularioNombre] = useState("");
  const [dependenciasSeleccionadas, setDependenciasSeleccionadas] = useState(
    []
  );

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

    fetch("http://localhost:4000/formulario", {
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
        console.error(error);
      });
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
                onChange={(event) => setFormularioNombre(event.target.value)}
              />

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
  );
};

export default CrearFormulario;
