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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import "../css/global.css";
import "../css/inicio.css";
import Login from "./login";
import { useHistory } from "react-router-dom";
import useStyles from "../styles/inicioStyle";
import API_BASE_URL from "../config";
import { logout, isLoggedIn } from "../auth";

function Inicio() {
  const classes = useStyles();
  const history = useHistory();
  const [inicioData, setInicioData] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [editableText, setEditableText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableObjetivos, setEditableObjetivos] = useState("");
  const [editableParrafo, setEditableParrafo] = useState("");
  const [editableTitulo, setEditableTitulo] = useState("");
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const userRole = sessionStorage.getItem("rol");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchActiveInicio = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/inicio/active`);
        const data = await response.json();
        setInicioData(data);
      } catch (error) {
        console.log("Error fetching active inicio data:", error);
      }
    };

    const fetchSecciones = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/secciones/conFormularioActivo`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch secciones with active formulario");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const validSecciones = data.filter(
            (seccion) => typeof seccion.id === "number"
          );
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

    // Update editableText only if not in editing mode
    if (inicioData && !isEditing) {
      setEditableTitulo(inicioData.tituloPrincipal);
      setEditableText(inicioData.introduccionDescripcion);
      setEditableObjetivos(inicioData.objetivoDescripcion);
      setEditableParrafo(inicioData.parrafo);
    }
  }, [inicioData, isEditing]);

  const handleButtonClick = () => {
    history.push("/formulario");
  };

  const handleLogout = async () => {
    logout(); // Espera a que la función logout termine
    window.location.reload();
  };

  const handleEditClick = () => {
    // Verifica si el usuario tiene el rol de "admin" antes de permitir la edición
    if (isAdmin) {
      setIsEditing(!isEditing);
      if (isEditing) {
        handleUpdate();
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inicio/${inicioData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tituloPrincipal: editableTitulo,
          introduccionDescripcion: editableText,
          objetivoDescripcion: editableObjetivos,
          parrafo: editableParrafo,
        }),
      });

      if (response.ok) {
        // Handle success, maybe show a notification or update local data
        console.log("Datos actualizados con éxito");
      } else {
        // Handle error, maybe show an error message
        console.log("Error al actualizar datos:", response.statusText);
      }
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  const handleCancelClick = () => {
    if (isEditing) {
      // Si ya has empezado a editar, abre el modal de confirmación
      setIsConfirmationOpen(true);
    } else {
      // Si no has empezado a editar, simplemente cambia el estado
      setIsEditing(!isEditing);
    }
  };

  const handleConfirmationClose = () => {
    // Cierra el modal de confirmación
    setIsConfirmationOpen(false);
  };

  const handleConfirmationYes = () => {
    // Confirma que desea cancelar la edición
    setIsEditing(false);
    setIsConfirmationOpen(false);
  };

  return (
    <Container className="mb80px">
      {isLoggedIn() ? (
        <>
          {inicioData ? ( // Check if inicioData exists
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <Button
                  className="boton-logout"
                  variant="outlined"
                  color="secondary"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </Box>

              <Typography variant="h1" className={classes.tituloPrincipal}>
                {isEditing ? (
                  <textarea
                    value={editableTitulo}
                    onChange={(e) => setEditableTitulo(e.target.value)}
                    rows={2} // Puedes ajustar el número de filas según tus necesidades
                    cols={50}
                  />
                ) : (
                  <>
                    {editableTitulo}
                    <Divider></Divider>
                  </>
                )}
              </Typography>
              <Typography variant="h2" className={classes.subtitulo}>
                INTRODUCCIÓN
              </Typography>
              {isEditing ? (
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  rows={4}
                  cols={50}
                />
              ) : (
                <Typography variant="body1" className="parrafo">
                  {editableText}
                </Typography>
              )}

              <Typography variant="h2" className={classes.subtitulo}>
                OBJETIVOS
              </Typography>
              {isEditing ? (
                <textarea
                  value={editableObjetivos}
                  onChange={(e) => setEditableObjetivos(e.target.value)}
                  rows={4}
                  cols={50}
                />
              ) : (
                <Typography variant="body1" className="parrafo">
                  {editableObjetivos}
                </Typography>
              )}
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
                        <TableCell className="texto-tabla">
                          {seccion.descripcion}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box height={50} />
              {isEditing ? (
                <textarea
                  value={editableParrafo}
                  onChange={(e) => setEditableParrafo(e.target.value)}
                  rows={4}
                  cols={50}
                />
              ) : (
                <Typography variant="body1" className="parrafo">
                  {editableParrafo}
                </Typography>
              )}

              <Box height={50} />
              {isAdmin && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEditClick}
                  >
                    {isEditing ? "Guardar" : "Editar"}
                  </Button>
                </>
              )}
              {isAdmin && isEditing && (
                <Button
                  style={{ marginLeft: "35px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelClick}
                >
                  Cancelar
                </Button>
              )}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <Typography variant="body1">
                No hay un formulario activo actualmente.
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Login />
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      ></Box>
      <Dialog open={isConfirmationOpen} onClose={handleConfirmationClose}>
        <DialogTitle>¿Desea cancelar la edición?</DialogTitle>
        <DialogContent>
          <Typography>
            Si cancela la edición, los cambios no se guardarán. ¿Está seguro?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmationYes} color="primary">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isSaveConfirmationOpen}
        onClose={() => setIsSaveConfirmationOpen(false)}
      >
        <DialogTitle>¿Desea guardar los cambios?</DialogTitle>
        <DialogContent>
          <Typography>
            Si guarda los cambios, se actualizarán los datos. ¿Está seguro?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsSaveConfirmationOpen(false)}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              setIsSaveConfirmationOpen(false);
              handleUpdate();
            }}
            color="primary"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Inicio;
