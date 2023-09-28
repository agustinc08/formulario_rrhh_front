import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import useStyles from "../../styles/buscadorStyle";

const BuscadorPreguntas = ({
  selectedPregunta,
  handlePreguntaChange,
  selectedFormulario,
  preguntasDelFormulario,
  preguntaDescripciones,
  seccionesDescripcion, // Agregamos las descripciones de las secciones
}) => {
  const classes = useStyles();

  // Función para ordenar las preguntas por sección
  const ordenarPreguntasPorSeccion = (preguntas) => {
    return preguntas.sort((a, b) =>
      seccionesDescripcion[a.seccionId].localeCompare(seccionesDescripcion[b.seccionId])
    );
  };

  // Ordenar las preguntas por sección
  const preguntasOrdenadas = ordenarPreguntasPorSeccion(preguntasDelFormulario);

  return (
    <FormControl variant="standard" fullWidth size="small">
      <InputLabel>Preguntas</InputLabel>
      <Select
        value={selectedPregunta || []}
        onChange={handlePreguntaChange}
        variant="standard"
        className={classes.select}
        fullWidth
        multiple
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={`${preguntaDescripciones[value]} (${seccionesDescripcion[preguntasDelFormulario.find(pregunta => pregunta.id === value)?.seccionId]})`} // Mostramos la descripción de la pregunta y la sección a la que pertenece
                className={classes.chip}
              />
            ))}
          </div>
        )}
      >
        {selectedFormulario === "" && (
          <MenuItem key="" value="">
            Todas las preguntas
          </MenuItem>
        )}
        {preguntasOrdenadas.map((pregunta) => (
          <MenuItem key={pregunta.id} value={pregunta.id}>
            <Chip
              icon={
                selectedPregunta.includes(pregunta.id) ? <CheckIcon /> : null
              }
              label={`${pregunta.descripcion} (${seccionesDescripcion[pregunta.seccionId]})`} // Mostramos la descripción de la pregunta y la sección
              className={classes.chip}
              clickable
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BuscadorPreguntas;
