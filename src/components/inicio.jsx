import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Divider,
} from "@material-ui/core";
import "../css/global.css";
import "../css/inicio.css";
import { isLoggedIn } from "../auth";
import Login from "./login";
import { useHistory } from "react-router-dom";
import useStyles from "../styles/inicioStyle";
import { useParams } from "react-router-dom";

function Inicio() {
  const classes = useStyles();
  const history = useHistory();
  const [inicioData, setInicioData] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const { formularioId } = useParams();

  useEffect(() => {
    const fetchFormularioData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/formulario/${formularioId}`
        );
        const data = await response.json();
        // Actualizar el estado con los datos del formulario seleccionado
        setInicioData(data.inicio);
        setSecciones(data.secciones);
      } catch (error) {
        console.log("Error fetching formulario data:", error);
      }
    };

    fetchFormularioData();
  }, [formularioId]);

  useEffect(() => {
    const fetchInicioData = async () => {
      try {
        const response = await fetch("http://localhost:3000/inicio");
        const data = await response.json();
        setInicioData(data);
      } catch (error) {
        console.log("Error fetching inicio data:", error);
      }
    };

    const fetchSecciones = async () => {
      try {
        const response = await fetch("http://localhost:3000/secciones");
        const data = await response.json();
        setSecciones(data);
      } catch (error) {
        console.log("Error fetching secciones:", error);
      }
    };

    fetchInicioData();
    fetchSecciones();
  }, []);

  const handleButtonClick = () => {
    history.push("/formulario"); // directs the user to the form page
  };

  return (
    <Container>
      {isLoggedIn() ? (
        <>
          {inicioData && (
            <>
              <Typography variant="h1" className={classes.tituloPrincipal}>
                {inicioData.tituloPrincipal}
                <Divider></Divider>
              </Typography>
              <Typography variant="h2" className={classes.subtitulo}>
                INTRODUCCIÓN
              </Typography>
              <Typography variant="body1" className="parrafo">
                {inicioData.introduccionDescripcion}
              </Typography>
              <Typography variant="h2" className={classes.subtitulo}>
                OBJETIVOS
              </Typography>
              <Typography variant="body1" className="parrafo">
                {inicioData.objetivoDescripcion}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="titulo-tabla">Sección</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secciones &&
                    secciones
                      .filter(
                        (seccion) =>
                          parseInt(seccion.formularioId) ===
                          parseInt(formularioId)
                      )
                      .map((seccion) => (
                        <TableRow key={seccion.id}>
                          <TableCell className="texto-tabla">
                            {seccion.descripcion}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <div className="separar">
                <Typography variant="body1" className="parrafo">
                  {inicioData.parrafo}
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
              </div>
            </>
          )}
        </>
      ) : (
        <Login />
      )}
    </Container>
  );
}

export default Inicio;
