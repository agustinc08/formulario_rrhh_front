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
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="standard" fullWidth size="small">
      <InputLabel>Preguntas</InputLabel>
      <Select
        variant="standard"
        className={classes.select}
        fullWidth
        multiple
        value={selectedPregunta || []}
        onChange={handlePreguntaChange}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => {
              const pregunta = selectedPregunta.find((pregunta) => pregunta.id === value);
              if (pregunta) {
                return (
                  <Chip
                    key={value}
                    label={pregunta.descripcion}
                    className={classes.chip}
                  />
                );
              }
              return null; // Return null for values that don't have a matching pregunta
            })}
          </div>
        )}
      >
        {selectedFormulario === "" && (
          <MenuItem key="todas" value="">
            Todas las preguntas
          </MenuItem>
        )}
        {preguntasDelFormulario.map((pregunta) => (
          <MenuItem key={pregunta.id} value={pregunta.id}>
            <Chip
              icon={
                selectedPregunta.includes(pregunta.id) ? <CheckIcon /> : null
              }
              label={pregunta.descripcion}
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
