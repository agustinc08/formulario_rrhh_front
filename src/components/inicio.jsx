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

function Inicio() {
  const classes = useStyles();
  const history = useHistory();
  const [inicioData, setInicioData] = useState(null);
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    const fetchActiveInicio = async () => {
      try {
        const response = await fetch("http://localhost:4000/inicio/active"); // Use a new route to fetch the active inicio
        const data = await response.json();
        setInicioData(data);
      } catch (error) {
        console.log("Error fetching active inicio data:", error);
      }
    };    

    const fetchSecciones = async () => {
      try {
        const response = await fetch("http://localhost:4000/secciones/conFormularioActivo"); // Use a new route to fetch secciones with active formulario
        if (!response.ok) {
          throw new Error('Failed to fetch secciones with active formulario');
        }
        const data = await response.json();
        // Validate the received data before setting the state
        if (Array.isArray(data) && data.length > 0) {
          // Validate each seccion's id to ensure it is a valid integer
          const validSecciones = data.filter((seccion) => typeof seccion.id === 'number');
          setSecciones(validSecciones);
        } else {
          console.log("No secciones with active formulario found.");
        }
      } catch (error) {
        console.log("Error fetching secciones with active formulario:", error);
      }
    };
    
    fetchActiveInicio(); 
    fetchSecciones();
  }, []);

  const handleButtonClick = () => {
    history.push("/formulario"); // directs the user to the form page
  };

  return (
    <Container className="mb80px">
      {isLoggedIn() ? (
        <>
              {inicioData ? ( // Check if inicioData exists
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
                    secciones.map((seccion) => (
                      <TableRow key={seccion.id}>
                        <TableCell className="texto-tabla">{seccion.descripcion}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box height={50} />
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
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <Typography variant="body1">
                No hay un formulario activo actualmente.
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Login />
      )}
    </Container>
  );
}

export default Inicio;