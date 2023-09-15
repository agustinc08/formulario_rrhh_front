import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import useStyles from "../../styles/buscadorStyle";

const BuscadorFormulario = ({ formularios, selectedFormulario, handleFormularioChange }) => {
  const classes = useStyles();

  return (
    <FormControl variant="standard" fullWidth size="small">
      <InputLabel>Formulario</InputLabel>
      <Select
        value={selectedFormulario}
        onChange={handleFormularioChange}
        variant="standard"
        className={classes.select}
        fullWidth
      >
        <MenuItem value="">Todos los formularios</MenuItem>
        {formularios.map((formulario) => (
          <MenuItem key={formulario.id} value={formulario.nombre}>
            {formulario.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BuscadorFormulario;
