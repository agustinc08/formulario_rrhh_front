import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Typography, Box, Grid } from "@material-ui/core";
import useStyles from "../../styles/estadisticasStyle";

const Graficos = ({
  estadisticasEdad,
  estadisticasGenero,
  estadisticasTipoRespuesta,
  tipoRespuestaDescripciones,
  reloadCharts,
}) => {
    const classes = useStyles();
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

  return (
    <div>
      <Grid item xs={12} md={6}>
        {reloadCharts && (
          <Box mx={4} className={classes.chartContainer}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <Typography variant="body1">Edad</Typography>
            </Box>
            <Doughnut
              data={{
                labels: Object.keys(estadisticasEdad),
                datasets: [
                  {
                    label: "Edad",
                    data: Object.values(estadisticasEdad),
                    backgroundColor: Object.keys(estadisticasEdad).map(() =>
                      getRandomColor()
                    ),
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Typography variant="body1">Genero</Typography>
        </Box>
        {reloadCharts && (
          <Box mx={4} className={classes.chartContainer}>
            <Doughnut
              data={{
                labels: Object.keys(estadisticasGenero),
                datasets: [
                  {
                    label: "Género",
                    data: Object.values(estadisticasGenero),
                    backgroundColor: Object.keys(estadisticasGenero).map(() =>
                      getRandomColor()
                    ),
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Typography variant="body1">Tipo de Respuesta</Typography>
        </Box>
        {reloadCharts && (
          <Box mx={4} className={classes.chartContainerIndividual}>
            <Pie
              data={{
                labels: Object.keys(estadisticasTipoRespuesta),
                datasets: [
                  {
                    label: "Tipo de Respuesta",
                    data: Object.values(estadisticasTipoRespuesta),
                    backgroundColor: Object.keys(estadisticasTipoRespuesta).map(
                      () => getRandomColor()
                    ),
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        )}
      </Grid>
    </div>
  );
};

export default Graficos;
