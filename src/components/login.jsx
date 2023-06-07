import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "../css/global.css";
import useStyles from "../styles/loginStyle";

function Login({ onLogin }) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dependencias, setDependencias] = useState([]);
  const [claves, setClaves] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dependencia = dependencias.find(
      (d) => d.nombreDependencia === username
    );
    if (dependencia) {
      const clave = claves.find(
        (c) => c.clave === password && c.dependencia.id === dependencia.id
      );
      if (clave) {
        console.log("Inicio de sesión exitoso!");
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("dependencia", dependencia.nombreDependencia);
        // Llama a la función onLogin pasada como prop desde App.js
        // para actualizar el estado isLoggedIn
        onLogin(dependencia.nombreDependencia, clave.clave);
        history.push("/inicio");
      } else {
        setErrorMessage("La clave es incorrecta para esta dependencia.");
        setOpen(true);
      }
    } else {
      setErrorMessage(
        "No se encontró una dependencia con este nombre de usuario."
      );
      setOpen(true);
    }
  };

  const fetchDependencias = async () => {
    const response = await fetch("http://localhost:3000/dependencias");
    const data = await response.json();
    setDependencias(data);
  };

  const fetchClaves = async () => {
    const response = await fetch("http://localhost:3000/claves");
    const data = await response.json();
    setClaves(data);
  };

  React.useEffect(() => {
    fetchDependencias();
    fetchClaves();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.imagen}></div>
        <div className={classes.login}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.textFieldContainer}>
              <TextField
                label="Dependencia"
                variant="outlined"
                className={classes.textField}
                value={username}
                onChange={handleUsernameChange}
              />
              <TextField
                label="Clave"
                variant="outlined"
                type="password"
                className={classes.textField}
                value={password}
                onChange={handlePasswordChange}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Iniciar sesión
              </Button>
            </div>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              className={classes.snackbar}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                severity="error"
                action={
                  <IconButton
                    size="small"
                    aria-label="Cerrar"
                    color="inherit"
                    onClick={handleClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {errorMessage}
              </MuiAlert>
            </Snackbar>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
