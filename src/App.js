import React from "react";
import Login from "./components/login";
import Preguntas from "./components/formulario.jsx";
import Inicio from "./components/inicio.jsx";
import Buscador from "./components/buscador.jsx";
import Estadisticas from "./components/estadisticas.jsx";
import Creacion from "./components/creacion";
import Navbar from "./components/navBar.jsx";
import Footer from "./components/footer.jsx";
import NotFound from "./components/notFound";

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
    setLoginData(rol);
    setIsLoggedIn(true);
    sessionStorage.setItem('rol', rol); // Actualiza el valor del rol en sessionStorage
  }

  let redirectPath = "/inicio";
  if (isLoggedIn) {
    if (rol === "admin") {
      redirectPath = "/creacion";
    } else if (rol === "dependencia") {
      redirectPath = "/inicio";
    } else if (rol === "usuario") {
      redirectPath = "/buscador";
    }
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to={redirectPath} />
        </Route>
        <Route exact path="/inicio">
          {isLoggedIn ? (
            <React.Fragment>
              {(rol === "admin" || rol === "usuario") && <Navbar />}
              <Inicio />
              <Footer />
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/formulario">
          {isLoggedIn ? (
            <React.Fragment>
              {(rol === "admin" || rol === "usuario") && <Navbar />}
              <Preguntas />
              <Footer />
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/formulario/:formularioId/inicio">
          {isLoggedIn ? (
            <React.Fragment>
              {(rol === "admin" || rol === "usuario") && <Navbar />}
              <Inicio />
              <Footer />
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
              <Footer />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/inicio" /> // Redirige a la página de inicio para usuarios con rol "usuario"
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/buscador">
          {isLoggedIn && (rol === "admin" || rol === "usuario") ? (
            <React.Fragment>
              <Navbar />
              <Buscador />
              <Footer />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/inicio" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/estadisticas">
          {isLoggedIn && (rol === "admin" || rol === "usuario") ? (
            <React.Fragment>
              <Navbar />
              <Estadisticas />
              <Footer />
            </React.Fragment>
          ) : isLoggedIn ? (
            <Redirect to="/inicio" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? (
            <Redirect to="/inicio" />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Route>

        <React.Fragment>
          <Navbar />
          <Route component={NotFound} />
          <Footer />
        </React.Fragment>
      </Switch>
    </Router>
  );
}

export default App;
