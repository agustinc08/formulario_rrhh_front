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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import useStyles from "../../styles/navBarStyle";

const ModalClaves = ({ open, handleClose }) => {
  const classes = useStyles();
  const [dependencias, setDependencias] = useState([]);
  const [claves, setClaves] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dependenciaId, setDependenciaId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [clave, setClave] = useState("");

  const fetchClaves = () => {
    fetch("http://localhost:4000/claves")
      .then((response) => response.json())
      .then((data) => {
        setClaves(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchClaves();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };  

    // Filtra las claves por la dependencia y clave en base al valor del buscador
    const filteredClaves = claves.filter(
      (clave) =>
        (clave.dependencia &&
          clave.dependencia.nombreDependencia &&
          clave.dependencia.nombreDependencia
            .toLowerCase()
            .includes(searchValue.toLowerCase())) ||
        (clave.clave &&
          clave.clave.toLowerCase().includes(searchValue.toLowerCase()))
    );

    const handleChangePassword = async () => {
      try {
        console.log("dependenciaId:", dependenciaId);
  
        // Verifica si dependenciaId está vacía antes de enviar la solicitud
        if (!dependenciaId) {
          console.error(
            "Debe seleccionar una dependencia para cambiar la clave."
          );
          return;
        }
  
        const response = await fetch(
          `http://localhost:4000/claves/${dependenciaId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clave: clave }),
          }
        );
  
        console.log("Response:", response);
  
        if (response.ok) {
          fetchClaves();
          setOpenChangePasswordDialog(false);
          setClave("");
        } else {
          console.error("Error al cambiar la clave");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

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
                        <TableCell className={classes.cellWithBorder}>
                          Dependencia
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          Clave
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          Polo
                        </TableCell>
                        <TableCell className={classes.cellWithBorder}>
                          Edificio
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {claves &&
                        filteredClaves.map((clave) => (
                          <TableRow key={clave.id}>
                            <TableCell className={classes.cellWithBorder}>
                              {clave.dependencia.nombreDependencia}
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {clave.clave}
                              <VpnKeyIcon
                                className="icon"
                                onClick={() => {
                                  setOpenChangePasswordDialog(true);
                                  setDependenciaId(clave.dependencia.id); // Establecer la dependenciaId al hacer clic
                                }}
                              />
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {clave.dependencia.polo}
                            </TableCell>
                            <TableCell className={classes.cellWithBorder}>
                              {clave.dependencia.edificio}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Modal>
        
          <Dialog
            open={openChangePasswordDialog}
            onClose={() => setOpenChangePasswordDialog(false)}
          >
            <DialogTitle>Cambiar Clave</DialogTitle>
            <DialogContent>
              <TextField
                label="Nueva Clave"
                variant="outlined"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChangePassword} color="primary">
                Cambiar Clave
              </Button>
            </DialogActions>
          </Dialog>
        </>)
};

export default ModalClaves;
