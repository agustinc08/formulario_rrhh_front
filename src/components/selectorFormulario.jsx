import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { isLoggedIn, getDependenciaId } from '../auth';
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import "../css/global.css";
import useStyles from "../styles/selectorFormularioStyle";

function SelectorFormulario() {
  const classes = useStyles();
  const loggedIn = isLoggedIn();
  const [formularios, setFormularios] = useState([]);
  const [selectedFormulario, setSelectedFormulario] = useState('');
  const history = useHistory();

  const getFormulariosPorDependenciaId = async (dependenciaId) => {
    try {
      const response = await fetch(`http://localhost:3000/formulario/${dependenciaId}/formularios`);
      if (!response.ok) {
        throw new Error('Error al obtener los formularios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener los formularios:', error);
      return [];
    }
  };


  useEffect(() => {
    const dependenciaId = getFormulariosPorDependenciaId();
    console.log('dependenciaId:', dependenciaId);
    if (dependenciaId) {
      // Llama a la función para obtener los formularios por la dependenciaId
      getFormulariosPorDependenciaId(dependenciaId)
        .then((data) => {
          setFormularios(data);
        })
        .catch((error) => {
          console.error('Error al obtener los formularios:', error);
        });
    }
  }, []);

  const handleFormularioChange = (event) => {
    setSelectedFormulario(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedFormulario === '') {
      console.log('Por favor, selecciona un formulario');
      return;
    }

    // Redirigir al usuario a la página del formulario seleccionado
    history.push(`/formulario/${selectedFormulario}/inicio`);
  };

  return (

    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.imagen}>
        </div>
        <div className={classes.seleccion}>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.textFieldContainer}>
              <h1>Bienvenido/a, {sessionStorage.getItem('dependencia')}</h1>
              <p>Por favor, selecciona el formulario al que deseas acceder:</p>
        
              <FormControl>
                <InputLabel id="formulario-label">Seleccionar formulario</InputLabel>
                <Select
                  className={classes.textField}
                  labelId="formulario-label"
                  id="formulario-select"
                  value={selectedFormulario}
                  onChange={handleFormularioChange}
                >
                  <MenuItem value="">Ningún formulario seleccionado</MenuItem>
                  {formularios.map((formulario) => (
                    <MenuItem key={formulario.id} value={formulario.id}>
                      {formulario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Acceder
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default SelectorFormulario;
