import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import Login from "./components/login";
import Preguntas from "./components/formulario.jsx";
import Inicio from "./components/inicio.jsx";
import Buscador from "./components/buscador.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  function handleLogin(username, password) {
    if (username === "dependencia" && password === "clave") {
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true); // Agregamos esta línea
      history.push("/inicio");
    } else {
      alert("Nombre de usuario o contraseña incorrectos");
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/inicio");
    }
  }, [isLoggedIn, history]);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            {isLoggedIn ? (
              <Redirect to="/inicio" />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Route>
          <Route exact path="/formulario">
            {isLoggedIn ? <Preguntas /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/inicio">
            {sessionStorage.getItem("isLoggedIn") === "true" ? (
              <Inicio />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/buscador">
            {isLoggedIn ? <Buscador /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/buscador">
            {sessionStorage.getItem("isLoggedIn") === "true" ? (
              <Inicio />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/formulario">
            {sessionStorage.getItem("isLoggedIn") === "true" ? (
              <Preguntas />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/login">
            {sessionStorage.getItem("isLoggedIn") === "true" ? (
              <Redirect to="/inicio" />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
