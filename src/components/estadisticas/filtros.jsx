import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Input,
  Button,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import useStyles from "../../styles/estadisticasStyle";

const Filtros = ({
  formularios,
  dependencias,
  preguntas, 
  selectedFormulario,
  selectedDependencias,
  selectedPregunta,
  handleFormularioChange,
  handleDependenciaChange,
  handlePreguntaChange,
  handleBuscarRespuestas,
}) => {
  const classes = useStyles(); // Move useStyles inside the component
  const [preguntaDescripciones, setPreguntaDescripciones] = useState([]);

  return (
    <div>
      {/* Filtro Formulario */}
      <FormControl variant="standard" fullWidth size="small">
        <InputLabel>Formulario</InputLabel>
        <Select
          value={selectedFormulario}
          onChange={handleFormularioChange}
          variant="standard"
          fullWidth
        >
          {formularios.map((formulario) => (
            <MenuItem key={formulario.id} value={formulario.nombre}>
              {formulario.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filtro Dependencias */}
      <FormControl variant="standard" fullWidth size="small">
        <InputLabel id="dependencias-label">Dependencias</InputLabel>
        <Select
          variant="standard"
          fullWidth
          labelId="dependencias-label"
          multiple
          value={selectedDependencias || []}
          onChange={handleDependenciaChange}
          input={<Input />}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </div>
          )}
        >
          {dependencias.map((dependencia) => (
            <MenuItem
              key={dependencia.id}
              value={dependencia.nombreDependencia}
            >
              <Chip
                icon={
                  selectedDependencias.includes(
                    dependencia.nombreDependencia
                  ) ? (
                    <CheckIcon />
                  ) : null
                }
                label={dependencia.nombreDependencia}
                className={classes.chip}
                clickable
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filtro Preguntas */}
      <FormControl className={classes.formControl}>
        <InputLabel id="pregunta-select-label">Preguntas</InputLabel>
        <Select
          labelId="pregunta-select-label"
          id="pregunta-select"
          multiple
          value={selectedPregunta}
          onChange={handlePreguntaChange}
          input={<Input />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={preguntaDescripciones[value]}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
        >
          {preguntas.map((preguntaId) => (
            <MenuItem key={preguntaId} value={preguntaId}>
              {preguntaDescripciones[preguntaId]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botón de búsqueda */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleBuscarRespuestas}
        fullWidth
        size="small"
      >
        Buscar
      </Button>
    </div>
  );
};

export default Filtros;
