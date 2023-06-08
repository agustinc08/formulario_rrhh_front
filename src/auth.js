const AUTH_TOKEN_KEY = 'isLoggedIn';

export const login = (username, clave, rol) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem("dependencia", username);
  sessionStorage.setItem("rol", rol);
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}