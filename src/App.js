import React from "react";
import Login from "./components/login";
import Preguntas from "./components/formulario.jsx";
import Inicio from "./components/inicio.jsx";
import Buscador from "./components/buscador.jsx";
import Estadisticas from "./components/estadisticas.jsx";
import Creacion from "./components/creacion";
import Navbar from "./components/navBar.jsx";
import Seleccion from "./components/selectorFormulario.jsx";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { setLoginData } from "./auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const rol = sessionStorage.getItem("rol");

  function handleLogin(username, password, rol) {
    setLoginData(username, password, rol);
    setIsLoggedIn(true);
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/seleccion" />
        </Route>
        <Route exact path="/seleccion">
          {isLoggedIn ? (
            <React.Fragment>
              <Seleccion />
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/formulario">
          {isLoggedIn ? (
            <React.Fragment>
              {rol === "admin" && <Navbar />}
              <Preguntas />
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/formulario/:formularioId/inicio">
          {isLoggedIn ? (
            <React.Fragment>
              {rol === "admin" && <Navbar />}
              <Inicio />
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/creacion">
          {isLoggedIn && rol === "admin" ? (
            <React.Fragment>
              <Navbar />
              <Creacion />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/seleccion" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/buscador">
          {isLoggedIn && rol === "admin" ? (
            <React.Fragment>
              <Navbar />
              <Buscador />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/seleccion" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/estadisticas">
          {isLoggedIn && rol === "admin" ? (
            <React.Fragment>
              <Navbar />
              <Estadisticas />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/seleccion" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? (
            <Redirect to="/seleccion" />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
