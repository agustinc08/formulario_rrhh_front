import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { isLoggedIn } from '../auth';

function SelectorFormulario() {
  const loggedIn = isLoggedIn();
  const [formularios, setFormularios] = useState([]);
  const [selectedFormulario, setSelectedFormulario] = useState('');

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
    const dependenciaId = sessionStorage.getItem('dependenciaId');
    console.log('dependenciaId:', dependenciaId);
    if (dependenciaId) {
      // Llama a la función para obtener los formularios por el dependenciaId
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

    // Aquí puedes redirigir o realizar la acción correspondiente al seleccionar el formulario
    console.log('Formulario seleccionado:', selectedFormulario);
  };

  if (!loggedIn) {
    // Redireccionar a la página de inicio de sesión si no ha iniciado sesión
    // Código para redireccionar a la página de inicio de sesión
    return null;
  }

  return (
    <div>
      <h1>Bienvenido(a), {sessionStorage.getItem('dependencia')}</h1>
      <p>Por favor, selecciona el formulario al que deseas acceder:</p>
      <FormControl>
        <InputLabel id="formulario-label">Seleccionar formulario</InputLabel>
        <Select
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
    </div>
  );
}

export default SelectorFormulario;
