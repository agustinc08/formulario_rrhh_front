const AUTH_TOKEN_KEY = 'isLoggedIn';

export const setLoginData = (username, clave, rol, dependenciaId) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem("dependencia", username);
  sessionStorage.setItem("rol", rol);

  if (dependenciaId) {
    sessionStorage.setItem("dependenciaId", dependenciaId.toString()); // Convertir a cadena de texto si es necesario
  } else {
    console.error('Valor de dependenciaId no válido:', dependenciaId);
  }
}


export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}