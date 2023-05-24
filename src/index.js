import React from "react";
import ReactDOM from "react-dom";
import Inicio from "./components/inicio.jsx";
import Preguntas from "./components/formulario.jsx";
import Login from "./components/login.jsx";
import Buscador from "./components/buscador.jsx";
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
    if (username === "dependencia" && password === "clave") {
      setIsLoggedIn(true);
    } else {
      alert("Nombre de usuario o contraseña incorrectos");
    }
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
        <Route exact path="/buscador">
          {isLoggedIn ? <Buscador /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? <Redirect to="/inicio" /> : <Login onLogin={handleLogin} />}
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));