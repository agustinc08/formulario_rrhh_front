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
  const [errorParrafo, setErrorParrafo] = useState(false);
  const [alertaCreacionExitosa, setAlertaCreacionExitosa] = useState(false);
  const [formularioId, setFormularioId] = useState("");
  const [inicioExistente, setInicioExistente] = useState(false);
  const [inicioCreado, setInicioCreado] = useState(false);

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

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
    console.log(selectedFormularioId)
  };

    // Define la función para verificar si ya existe un inicio para el formulario
    const verificarInicioPorFormulario = async (formularioId) => {
      try {
        const response = await fetch(`http://localhost:4000/inicio/verificar/${formularioId}`);
        if (response.ok) {
          const data = await response.json();
          return data; // Puedes ajustar esto según la estructura de respuesta de tu servidor
        } else {
          throw new Error('Error verificando el inicio por formulario');
        }
      } catch (error) {
        console.error('Error al verificar inicio por formulario:', error);
        return null;
      }
    };

  const handleInicioSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones antes de enviar el formulario
    if (!tituloPrincipal || !introduccionDescripcion || !objetivoDescripcion || !parrafo) {
      setErrorTituloPrincipal(!tituloPrincipal);
      setErrorIntroduccionDescripcion(!introduccionDescripcion);
      setErrorObjetivoDescripcion(!objetivoDescripcion);
      setErrorParrafo(!parrafo);
      return;
    }
  
    try {
      // Verificar si ya existe un inicio para el formulario
      const inicioExistente = await verificarInicioPorFormulario(formularioId);
      if (inicioExistente) {
        setInicioExistente(true);
        return;
      }
  
      // Llamada a la API para crear el inicio
      const response = await fetch("http://localhost:4000/inicio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tituloPrincipal,
          introduccionDescripcion,
          objetivoDescripcion,
          parrafo,
          formularioId,
        }),
      });
  
      if (response.ok) {
        setAlertaCreacionExitosa(true);
        setInicioCreado(true);
        setInicioExistente(false);
        // Limpia los campos después de la creación exitosa
        setTituloPrincipal("");
        setIntroduccionDescripcion("");
        setObjetivoDescripcion("");
        setParrafo("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al crear el inicio:", error);
    }
  };

  return (
    <Box
      className={`${classes.boxDerecho} ${classes.boxForm} ${"boxCrearInicio"}`}
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
        {errorTituloPrincipal && (
          <p className={classes.error}>Falta el título principal.</p>
        )}
        <TextField
          className={classes.textField}
          type="text"
          placeholder="Descripción de introducción"
          value={introduccionDescripcion}
          onChange={(e) => setIntroduccionDescripcion(e.target.value)}
        />
        {errorIntroduccionDescripcion && (
          <p className={classes.error}>Falta la introduccion.</p>
        )}
        <TextField
          className={classes.textField}
          type="text"
          placeholder="Descripción de objetivo"
          value={objetivoDescripcion}
          onChange={(e) => setObjetivoDescripcion(e.target.value)}
        />
        {errorObjetivoDescripcion && (
          <p className={classes.error}>Falta la descripcion del objetivo.</p>
        )}
        <TextField
          className={classes.textField}
          placeholder="Párrafo"
          value={parrafo}
          onChange={(e) => setParrafo(e.target.value)}
        ></TextField>
        {errorParrafo && <p className={classes.error}>Falta el parrafo.</p>}
        <FormControl className={classes.textField}>
          <InputLabel id="formulario-label">Formulario</InputLabel>
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

        {inicioExistente && (
          <p className={classes.error}>
            Ya existe un inicio para este formulario.
          </p>
        )}
      </form>
    </Box>
  );
};

export default CrearInicio;
