import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    border: '1px solid black',
    padding: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const Creaciones = () => {
  const classes = useStyles();

  const [dependenciaNombre, setDependenciaNombre] = useState('');
  const [seccionDescripcion, setSeccionDescripcion] = useState('');
  const [preguntaDescripcion, setPreguntaDescripcion] = useState('');
  const [tieneComentario, setTieneComentario] = useState(false);
  const [tieneExpresion, setTieneExpresion] = useState(false);
  const [tieneCalificaciones, setTieneCalificaciones] = useState(false);
  const [tieneClasificaciones, setTieneClasificaciones] = useState(false);
  const [tieneGrado, setTieneGrado] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [seccionId, setSeccionId] = useState('');
  const [alerta, setAlerta] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSecciones();
  }, []);

  const fetchSecciones = () => {
    fetch('http://localhost:3000/secciones')
      .then(response => response.json())
      .then(data => setSecciones(data))
      .catch(error => console.log(error));
  };

  const handleDependenciaSubmit = (event) => {
    event.preventDefault();
    if (dependenciaNombre.trim() === '') {
      setError('El nombre de la dependencia es requerido.');
      return;
    }
    crearDependencia(dependenciaNombre);
  };

  const crearDependencia = (nombre) => {
    // Realizar la llamada a la API para crear la dependencia usando el valor de nombre
    console.log('Crear dependencia:', nombre);
    setAlerta(true);
    setDependenciaNombre('');
    setError('');
  };

  const handleSeccionSubmit = (event) => {
    event.preventDefault();
    if (seccionDescripcion.trim() === '') {
      setError('La descripción de la sección es requerida.');
      return;
    }
    crearSeccion(seccionDescripcion);
  };

  const crearSeccion = (descripcion) => {
    // Realizar la llamada a la API para crear la sección usando el valor de descripcion
    console.log('Crear sección:', descripcion);
    setAlerta(true);
    setSeccionDescripcion('');
    setError('');
  };

  const handlePreguntaSubmit = (event) => {
    event.preventDefault();
    if (preguntaDescripcion.trim() === '') {
      setError('La descripción de la pregunta es requerida.');
      return;
    }
    if (seccionId === '') {
      setError('Debe seleccionar una sección.');
      return;
    }
    crearPregunta(preguntaDescripcion, tieneComentario, tieneExpresion, tieneCalificaciones, tieneClasificaciones, tieneGrado, seccionId);
  };

  const crearPregunta = (descripcion, comentario, expresion, calificaciones, clasificaciones, grado, seccion) => {
    // Realizar la llamada a la API para crear la pregunta usando los valores proporcionados
    console.log('Crear pregunta:', descripcion, comentario, expresion, calificaciones, clasificaciones, grado, seccion);
    setAlerta(true);
    setPreguntaDescripcion('');
    setSeccionId('');
    setError('');
  };

  return (
    <div className={classes.container}>
      <div className={classes.form}>
        <h2>Crear Dependencia</h2>
        <form onSubmit={handleDependenciaSubmit}>
          <TextField
            className={classes.textField}
            label="Nombre de la Dependencia"
            value={dependenciaNombre}
            onChange={(event) => setDependenciaNombre(event.target.value)}
            error={error && !dependenciaNombre.trim()}
            helperText={error}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Crear Dependencia
          </Button>
          {alerta && (
            <Alert severity="success">¡La dependencia se creó correctamente!</Alert>
          )}
        </form>
      </div>

      <div className={classes.form}>
        <h2>Crear Sección</h2>
        <form onSubmit={handleSeccionSubmit}>
          <TextField
            className={classes.textField}
            label="Descripción de la Sección"
            value={seccionDescripcion}
            onChange={(event) => setSeccionDescripcion(event.target.value)}
            error={error && !seccionDescripcion.trim()}
            helperText={error}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Crear Sección
          </Button>
          {alerta && (
            <Alert severity="success">¡La sección se creó correctamente!</Alert>
          )}
        </form>
      </div>

      <div className={classes.form}>
        <h2>Crear Pregunta</h2>
        <form onSubmit={handlePreguntaSubmit}>
          <TextField
            className={classes.textField}
            label="Descripción de la Pregunta"
            value={preguntaDescripcion}
            onChange={(event) => setPreguntaDescripcion(event.target.value)}
            error={error && !preguntaDescripcion.trim()}
            helperText={error}
          />
          <div>
            <label>
              Tiene Comentario:
              <input
                type="checkbox"
                checked={tieneComentario}
                onChange={() => setTieneComentario(!tieneComentario)}
              />
            </label>
          </div>
          <div>
            <label>
              Tiene Expresión:
              <input
                type="checkbox"
                checked={tieneExpresion}
                onChange={() => setTieneExpresion(!tieneExpresion)}
              />
            </label>
          </div>
          <div>
            <label>
              Tiene Calificaciones:
              <input
                type="checkbox"
                checked={tieneCalificaciones}
                onChange={() => setTieneCalificaciones(!tieneCalificaciones)}
              />
            </label>
          </div>
          <div>
            <label>
              Tiene Clasificaciones:
              <input
                type="checkbox"
                checked={tieneClasificaciones}
                onChange={() => setTieneClasificaciones(!tieneClasificaciones)}
              />
            </label>
          </div>
          <div>
            <label>
              Tiene Grado:
              <input
                type="checkbox"
                checked={tieneGrado}
                onChange={() => setTieneGrado(!tieneGrado)}
              />
            </label>
          </div>
          <FormControl className={classes.textField}>
            <InputLabel>Seleccionar Sección</InputLabel>
            <Select
              value={seccionId}
              onChange={(event) => setSeccionId(event.target.value)}
              error={error && seccionId === ''}
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
          </FormControl>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Crear Pregunta
          </Button>
          {alerta && (
            <Alert severity="success">¡La pregunta se creó correctamente!</Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default Creaciones;
