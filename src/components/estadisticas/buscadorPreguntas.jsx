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
}) => {
  const classes = useStyles();

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
                label={preguntaDescripciones[value]}
                className={classes.chip}
              />
            ))}
          </div>
        )}
      >
        {selectedFormulario === "" && (
          <MenuItem key="xd" value="">
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
