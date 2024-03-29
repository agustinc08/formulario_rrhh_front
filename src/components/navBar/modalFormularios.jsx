import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  TableContainer,
  IconButton,
  Table,
  TableHead,
  TableRow,
  Button,
  TableCell,
  TableBody,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../../styles/navBarStyle";
import "../../css/navbar.css"
import "../../css/global.css";
import API_BASE_URL from "../../config"

const ModalFormularios = ({ open, handleClose }) => {
  const classes = useStyles();
  const [formularios, setFormularios] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [isFormularioActivo, setIsFormularioActivo] = useState(false);

  const fetchFormulario = () => {
    fetch(`${API_BASE_URL}/formulario`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching formularios");
        }
        return response.json();
      })
      .then((data) => {
        setFormularios(data);
        const hasActiveFormulario = data.some(
          (formulario) => formulario.estaActivo
        );
        setIsFormularioActivo(hasActiveFormulario);
      })
      .catch((error) => {
        console.log("Error fetching formularios:", error);
      });
  };

  const handleToggleFormularioActivo = async (formularioToToggle) => {
    try {
      const updatedFormulario = {
        ...formularioToToggle,
        estaActivo: !formularioToToggle.estaActivo,
      };

      await fetch(`${API_BASE_URL}/formulario/${formularioToToggle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormulario),
      });

      // Fetch the updated formularios from the server
      fetchFormulario();
    } catch (error) {
      console.error("Error updating formulario:", error);
    }
  };

  useEffect(() => {
    fetchFormulario();
  }, []);
 

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredFormularios = formularios.filter(
    (formulario) =>
      formulario.nombre &&
      formulario.nombre.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedFormularios = formularios.sort((a, b) => a.id - b.id);

    return (
        <>    
        
             <Modal open={open} onClose={handleClose} className="modal">
              <Paper className="modalContent smallModal">
                <TableContainer>
                  <IconButton
                    aria-label="close"
                    className="closeButton"
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                  <TextField
                    label="Buscar"
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    margin="normal"
                    style={{ width: "90%" }}
                  />
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="columnaId">Formulario</TableCell>
                        <TableCell className="columnaTexto">Nombre</TableCell>
                        <TableCell className="columnaTexto">
                          Formulario Activo
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formularios &&
                        filteredFormularios &&
                        sortedFormularios.map((formulario) => (
                          <TableRow key={formulario.id}>
                            <TableCell className={classes.cellWithBorder}>
                              {formulario.id}
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {formulario.nombre}
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleToggleFormularioActivo(formulario)
                                }
                                disabled={
                                  isFormularioActivo && !formulario.estaActivo
                                }
                              >
                                {formulario.estaActivo ? "Desactivar" : "Activar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Modal>
        
        </>)
};

export default ModalFormularios;
