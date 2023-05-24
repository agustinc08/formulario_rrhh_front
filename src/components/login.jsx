import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import backgroundImage from "../41-0.131209001550177303_B.jpg";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  textFieldContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    border: "5px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#eeeeee",
  },
  textField: {
    margin: "10px 0",
    width: "100%",
    maxWidth: "350px",
  },
  button: {
    margin: "20px 0 0 0",
    width: "100%",
    maxWidth: "350px",
    height: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  snackbar: {
    top: "auto",
    bottom: "20px",
    right: "20px",
  },
}));


function Login() {
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
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("dependencia", dependencia.nombreDependencia);
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
  }

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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
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
  );
}

export default withRouter(Login); // exportar Login con withRoute
