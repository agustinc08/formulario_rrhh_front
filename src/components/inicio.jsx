import React from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../components/inicio.css";
import "../components/global.css";
import { isLoggedIn } from "../auth";
import Login from "./login";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  subtitulo: {
    fontSize: "22px !important",
    marginBottom: "10px",
    marginTop: "20px",
  },
  tituloPrincipal: {
    fontSize: "46px !important",
    textAlign: "center",
    marginBottom: "30px",
  },
}));

function Inicio() {
  const classes = useStyles();
  const history = useHistory();

  const handleButtonClick = () => {
    history.push("/formulario"); // dirige al usuario al formulario de preguntas
  };

  return (
    <div className="contenedor-principal">
      {isLoggedIn() ? (
        <>
          <Typography variant="h1" className={classes.tituloPrincipal}>
            Relevamiento Fuero Civil - 2023
            <hr />
          </Typography>
          <Typography variant="h2" className={classes.subtitulo}>
            INTRODUCCIÓN
          </Typography>
          <Typography variant="body1" className="parrafo">
            El presente relevamiento general tiene como finalidad conocer
            aspectos del trabajo cotidiano en las distintas dependencias del
            fuero para desarrollar acciones en los temas que así lo requieran,
            con el fin de mejorar el clima laboral, la comunicación,
            coordinación de tareas, entre otras. Es importante relevar también
            los efectos de las modificaciones que introdujeron la pandemia y el
            ASPO en relación a las formas de funcionamiento.
          </Typography>
          <Typography variant="body1" className="parrafo">
            Participará todo el personal que se viene desempeñando en el Fuero
            Civil de manera interina, suplente, contratada, provisional o
            efectiva y cuente con más de un mes de antigüedad en el cargo.
          </Typography>
          <Typography variant="h2" className={classes.subtitulo}>
            OBJETIVOS
          </Typography>
          <Typography variant="body1" className="parrafo">
            El presente relevamiento tiene como objetivo sistematizar
            información actualizada y pertinente, con el fin de identificar los
            principales determinantes en los procesos de trabajo y sus efectos
            en las personas que las llevan adelante, las tareas que desarrollan
            y el funcionamiento de las dependencias. Esta instancia forma parte
            de un proceso de trabajo más amplio, cuya finalidad es el
            mejoramiento de las dimensiones que se detallan a continuación en
            los equipos de trabajo y las distintas dependencias.
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="titulo-tabla">Sección</TableCell>
                <TableCell className="titulo-tabla">Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="texto-tabla">Clima laboral</TableCell>
                <TableCell className="texto-tabla">
                  Preguntas sobre el clima laboral en la dependencia.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="texto-tabla">Violencia/agresión externa</TableCell>
                <TableCell className="texto-tabla">
                  Preguntas sobre la violencia y la agresión externa en el lugar
                  de trabajo.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="texto-tabla">
                  Relaciones interpersonales en el grupo de trabajo
                </TableCell>
                <TableCell  className="texto-tabla">
                  Preguntas sobre las relaciones interpersonales en el grupo de
                  trabajo.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="texto-tabla">Infraestructura</TableCell>
                <TableCell className="texto-tabla">
                  Preguntas sobre la infraestructura en la dependencia.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="texto-tabla">Tareas y formas de trabajo</TableCell>
                <TableCell className="texto-tabla">
                  Preguntas sobre las tareas y formas de trabajo en la
                  dependencia.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="texto-tabla">Comunicación</TableCell>
                <TableCell className="texto-tabla">
                  Preguntas sobre la comunicación en la dependencia.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <hr />
          <Typography variant="body1" className="parrafo">
            A continuación, encontrarán una serie de preguntas les pedimos que
            respondan con la mayor sinceridad posible; marcando la alternativa
            que mejor describa lo que usted siente y piensa. No existen
            respuestas correctas o incorrectas, solo es información acerca de
            “su opinión sobre el tema”. La encuesta es obligatoria, anónima y
            confidencial. El relevamiento busca sistematizar información
            actualizada, por lo que le solicitamos centre sus respuestas en el
            período 2022 y 2023.
          </Typography>
          <Box height={50} />
          <Box className="botonContainer">
           <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
              
            >
              ir a preguntas
            </Button>
          </Box>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Inicio;
