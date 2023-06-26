const AUTH_TOKEN_KEY = 'isLoggedIn';
const DEPENDENCIA_ID_KEY = 'dependenciaId';

export const setLoginData = (username, clave, rol, dependenciaId) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem("dependencia", username);
  sessionStorage.setItem("rol", rol);
  if (dependenciaId !== undefined && dependenciaId !== null) {
    sessionStorage.setItem(DEPENDENCIA_ID_KEY, dependenciaId.toString());
  } else {
    // Manejar el caso en el que dependenciaId sea undefined o null
    sessionStorage.removeItem(DEPENDENCIA_ID_KEY);
  }
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(DEPENDENCIA_ID_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}

export const getDependenciaId = () => {
  return parseInt(sessionStorage.getItem(DEPENDENCIA_ID_KEY)); // Asegúrate de convertir el ID almacenado a un número entero
}
