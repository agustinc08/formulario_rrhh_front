const AUTH_TOKEN_KEY = 'isLoggedIn';
const DEPENDENCIA_ID_KEY = 'dependenciaId';

export const setLoginData = (username, clave, rol, dependenciaId) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem("dependencia", username);
  sessionStorage.setItem("rol", rol);
  if (dependenciaId !== undefined && dependenciaId !== null) {
    sessionStorage.setItem(DEPENDENCIA_ID_KEY, dependenciaId.toString());
  } else {
    sessionStorage.removeItem(DEPENDENCIA_ID_KEY);
  }
}

export const getDependenciaId = () => {
  const dependenciaId = sessionStorage.getItem(DEPENDENCIA_ID_KEY);
  if (dependenciaId !== null) {
    return parseInt(dependenciaId);
  }
  return null;
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(DEPENDENCIA_ID_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}

