import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "@material-ui/core/Checkbox";
import { Box } from "@material-ui/core";
import useStyles from "../../styles/creacionStyle";
import API_BASE_URL from "../../config"

const CrearPregunta = () => {
  const classes = useStyles();
  const [tieneComentario, setTieneComentario] = useState(false);
  const [tieneTipoPregunta, setTieneTipoPregunta] = useState(false);
  const [descripcionComentario, setDescripcionComentario] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [seccionId, setSeccionId] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [errorSeccion, setErrorSeccion] = useState(false);
  const [errorPregunta, setErrorPregunta] = useState(false);
  const [alertaPregunta, setAlertaPregunta] = useState(false);
  const [tipoPreguntaId, setTipoPreguntaId] = useState("");
  const [tipoRespuestaId, setTipoRespuestaId] = useState("");
  const [tipoPreguntas, setTipoPreguntas] = useState([]);
  const [formularioId, setFormularioId] = useState("");
  const [errorCreacion, setErrorCreacion] = useState(false);

  useEffect(() => {
    fetchFormulario();
    fetchTipoPreguntas();
    fetchSecciones();
  }, []);

  useEffect(() => {
    if (errorCreacion) {
      const timeoutId = setTimeout(() => {
        setErrorCreacion(false);
      }, 2000); // 2000 milisegundos (2 segundos)
  
      // Limpia el temporizador cuando el componente se desmonta o el estado cambia
      return () => clearTimeout(timeoutId);
    }
  }, [errorCreacion]);

  const fetchSecciones = () => {
    fetch(`${API_BASE_URL}/secciones`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener las secciones.");
        }
      })
      .then((data) => {
        console.log("Secciones obtenidas:", data);
        setSecciones(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    setAlertaPregunta(false);
  };

  const handleComentarioCheckboxChange = (event) => {
    setTieneComentario(event.target.checked);
  };

  const handleTipoPreguntaCheckboxChange = (event) => {
    setTieneTipoPregunta(event.target.checked);
  };

  const handleFormularioChange = (event) => {
    const selectedFormularioId = event.target.value;
    setFormularioId(selectedFormularioId);
  };

  const handleSeccionChange = (event) => {
    const seccionId = event.target.value;
    setSeccionId(seccionId);
  };

  const handleTipoPreguntaChange = (event) => {
    const selectedTipoPreguntaId = event.target.value;
    setTipoPreguntaId(selectedTipoPreguntaId !== null ? selectedTipoPreguntaId : null);
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

    if (!tieneTipoPregunta && !tieneComentario) {
      // Mostrar un mensaje de error o tomar alguna otra acción aquí si es necesario
      console.error("Debe seleccionar al menos uno: tieneTipoPregunta o tieneComentario");
      setErrorCreacion(true);
      return;
    }

    crearPregunta({
      descripcion: pregunta,
      seccionId: seccionId,
      tieneComentario: tieneComentario,
      tieneTipoPregunta: tieneTipoPregunta,
      descripcionComentario: descripcionComentario,
      tipoPreguntaId: tipoPreguntaId ?? null,
      tipoRespuestaId: tipoRespuestaId ?? null
    });
    setPregunta("");
    setSeccionId("");
    setTieneComentario(false);
    setDescripcionComentario("");
  };

  const crearPregunta = ({
    descripcion,
    seccionId,
    tieneComentario,
    tieneTipoPregunta,
    descripcionComentario,
    tipoPreguntaId, // No conviertas esto a una cadena vacía ('') si es nulo
    tipoRespuestaId,
  }) => {
    const requestData = {
      formularioId: formularioId,
      descripcion: descripcion,
      seccionId: seccionId,
      tieneComentario: tieneComentario,
      tieneTipoPregunta: tieneTipoPregunta,
      descripcionComentario: descripcionComentario,
    };
  
    // Solo incluir tipoPreguntaId si está definido
    if (tipoPreguntaId !== null) {
      requestData.tipoPreguntaId = tipoPreguntaId;
    }
  
    // Solo incluir tipoRespuestaId si está definido
    if (tipoRespuestaId !== null) {
      requestData.tipoRespuestaId = tipoRespuestaId;
    }
  
    fetch(`${API_BASE_URL}/preguntas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Pregunta creada:", descripcion);
          setAlertaPregunta(true);
          setPregunta("");
          setSeccionId("");
          setErrorPregunta(false);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
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
        <Box
             className={`${classes.boxForm} ${classes.boxDerecho}`}
             boxShadow={8}
             borderRadius={7}
           >
             <form onSubmit={handlePreguntaSubmit} className={classes.form}>
               <p className={classes.tituloForm}>CREAR PREGUNTA</p>
               <TextField
                 className={classes.textField}
                 label="Pregunta"
                 value={pregunta}
                 onChange={(event) => setPregunta(event.target.value)}
                 error={errorPregunta}
               />

               <FormControlLabel
                 control={
                   <Checkbox
                     checked={tieneComentario}
                     onChange={handleComentarioCheckboxChange}
                     style={{ color: "#00e676" }}
                   />
                 }
                 label="Tiene Comentario"
               />
               {tieneComentario && (
                 <TextField
                   className={classes.textField}
                   label="Descripción del Comentario"
                   value={descripcionComentario}
                   onChange={(event) =>
                     setDescripcionComentario(event.target.value)
                   }
                 />
               )}

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

               <FormControl className={classes.textField}>
                 <InputLabel id="secciones-label">Sección</InputLabel>
                 <Select value={seccionId} onChange={handleSeccionChange}>
                   <MenuItem value="">
                     <em>Seleccionar</em>
                   </MenuItem>
                   {secciones
                     .filter((seccion) => seccion.formularioId === formularioId)
                     .map((seccion) => (
                       <MenuItem key={seccion.id} value={seccion.id}>
                         {seccion.descripcion}
                       </MenuItem>
                     ))}
                 </Select>
               </FormControl>

               <FormControlLabel
                 control={
                   <Checkbox
                     checked={tieneTipoPregunta}
                     onChange={handleTipoPreguntaCheckboxChange}
                     style={{ color: "#00e676" }}
                   />
                 }
                 label="Tiene Tipo de Pregunta ?"
               />
               {tieneTipoPregunta && (
                 <FormControl className={classes.textField}>
                   <InputLabel id="tipo-pregunta-select-label">
                     Tipo de Pregunta
                   </InputLabel>
                   <Select
                     value={tipoPreguntaId}
                     onChange={handleTipoPreguntaChange}
                   >
                     {tipoPreguntas.map((tipoPregunta) => (
                       <MenuItem key={tipoPregunta.id} value={tipoPregunta.id}>
                         {tipoPregunta.descripcion}
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               )}
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
               {errorCreacion && (
                 <Alert severity="error">
                   ¡La pregunta debe contener un comentario o un tipo de pregunta!
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
  );
};

export default CrearPregunta;