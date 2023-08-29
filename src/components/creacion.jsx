import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "../css/global.css";
import "../css/creacion.css";
import useStyles from "../styles/creacionStyle";
import CrearFormulario from "./creacion/crearFormulario";
import CrearSeccion from "./creacion/crearSeccion";
import CrearInicio from "./creacion/crearInicio";
import CrearPregunta from "./creacion/crearPregunta";
import CrearTipoPregunta from "./creacion/crearTipoPregunta";
import CrearTipoRespuesta from "./creacion/crearTipoRespuesta";

const Creaciones = () => {
  const classes = useStyles();

  return (
  <div className={`${classes.divMain} 'mb80px'`} style={{ display: "flex" }}>
    <Grid container spacing={6} className={classes.gridPrincipal}>
      <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={`${classes.cardCreacion} ${classes.gridIzquierdo}`}
          >
        <CrearFormulario/>
        <CrearSeccion/>
        <CrearTipoPregunta/>
      </Grid>
 
      <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={`${classes.cardCreacion} ${classes.gridDerecho}`}
        >
        <CrearInicio/>
        <CrearPregunta/>
        <CrearTipoRespuesta/>
      </Grid>
    </Grid>
  </div>
    );
};

export default Creaciones;
