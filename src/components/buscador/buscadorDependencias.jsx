import React from "react";
import { FormControl, InputLabel, Select, Chip, MenuItem, Input } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import useStyles from '../../styles/buscadorStyle';

const BuscadorDependencias = ({ dependencias, selectedDependencias, handleDependenciaChange }) => {
  const classes = useStyles();

  return (
    <FormControl variant="standard" fullWidth size="small">
      <InputLabel id="dependencias-label">Dependencias</InputLabel>
      <Select
        variant="standard"
        className={classes.select}
        fullWidth
        labelId="dependencias-label"
        multiple
        value={selectedDependencias || []}
        onChange={handleDependenciaChange}
        input={<Input />}
        renderValue={(selected) => (
          <div>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                icon={
                  selectedDependencias.includes(value) ? <CheckIcon /> : null
                }
                className={classes.chip}
                clickable
              />
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
  );
};

export default BuscadorDependencias;
