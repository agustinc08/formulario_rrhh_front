import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";

const CrearInicio = () => {
  const classes = useStyles();
  const [formularios, setFormularios] = useState([]);
  const [tituloPrincipal, setTituloPrincipal] = useState("");
  const [introduccionDescripcion, setIntroduccionDescripcion] = useState("");
  const [objetivoDescripcion, setObjetivoDescripcion] = useState("");
  const [parrafo, setParrafo] = useState("");
  const [errorTituloPrincipal, setErrorTituloPrincipal] = useState(false);
  const [errorIntroduccionDescripcion, setErrorIntroduccionDescripcion] =
    useState(false);
  const [errorObjetivoDescripcion, setErrorObjetivoDescripcion] =
    useState(false);
  const [inicioCreado, setInicioCreado] = useState(false);
  const [errorParrafo, setErrorParrafo] = useState(false);
  const [alertaInicio, setAlertaInicio] = useState(false);
  const [alertaInicioExistente, setAlertaInicioExistente] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioId, setFormularioId] = useState("");

  useEffect(() => {
    fetchFormulario();
  }, []);

  const fetchFormulario = () => {
    fetch("http://localhost:4000/formulario")
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
    fetch(`http://localhost:4000/inicio?formularioId=${formularioId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de inicio");
        
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === false) {
          setAlertaInicioExistente(true);
        } else {
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
      console.error("El formularioId no se ha proporcionado");
      return;
    }

    fetch("http://localhost:4000/inicio", {
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

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
  };

  return (
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
               {errorTituloPrincipal && <p className={classes.error}>Falta el título principal.</p>}
              <TextField
                className={classes.textField}
                type="text"
                placeholder="Descripción de introducción"
                value={introduccionDescripcion}
                onChange={(e) => setIntroduccionDescripcion(e.target.value)}
              />
               {errorIntroduccionDescripcion && <p className={classes.error}>Falta la introduccion.</p>}
              <TextField
                className={classes.textField}
                type="text"
                placeholder="Descripción de objetivo"
                value={objetivoDescripcion}
                onChange={(e) => setObjetivoDescripcion(e.target.value)}
              />
              {errorObjetivoDescripcion && <p className={classes.error}>Falta la descripcion del objetivo.</p>}
              <TextField
                className={classes.textField}
                placeholder="Párrafo"
                value={parrafo}
                onChange={(e) => setParrafo(e.target.value)}
              ></TextField>
                {errorParrafo && <p className={classes.error}>Falta el parrafo.</p>}
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
    );
};

export default CrearInicio;
