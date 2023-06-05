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

  function handleLogin(username, password) {
    // No es necesario verificar los valores de usuario y contraseña aquí
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("dependencia", username);
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
          {isLoggedIn ? <Creacion /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/buscador">
          {isLoggedIn ? <Buscador /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/estadisticas">
          {isLoggedIn ? <Estadisticas /> : <Redirect to="/login" />}
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