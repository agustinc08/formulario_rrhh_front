import React from "react";
import Login from "./components/login";
import Preguntas from "./components/formulario.jsx";
import Inicio from "./components/inicio.jsx";
import Buscador from "./components/buscador.jsx";
import Estadisticas from "./components/estadisticas.jsx";
import Creacion from "./components/creacion";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";


function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const rol = sessionStorage.getItem("rol");

  function handleLogin(username, password) {
    // Autenticación de usuario y contraseña

    // Asignación del rol (ejemplo, asumiendo que todos los usuarios "dependencia" tienen el mismo rol y todos los usuarios "admin" tienen el mismo rol)
    let rol = username === "dependencia" ? "dependencia" : "admin";
    login(username, password, rol);

    // Otros pasos después del inicio de sesión
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/inicio" />
        </Route>
        <Route exact path="/inicio">
          {isLoggedIn ? <Inicio /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/formulario">
          {isLoggedIn ? <Preguntas /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/creacion">
          {isLoggedIn && rol === "admin" ? (
            <Creacion />
          ) : (
            isLoggedIn ? <Redirect to="/inicio" /> : <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/buscador">
          {isLoggedIn && rol === "admin" ? (
            <Buscador />
          ) : (
            isLoggedIn ? <Redirect to="/inicio" /> : <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/estadisticas">
          {isLoggedIn && rol === "admin" ? (
            <Estadisticas />
          ) : (
            isLoggedIn ? <Redirect to="/inicio" /> : <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? (
            <Redirect to="/inicio" />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;