const AUTH_TOKEN_KEY = 'isLoggedIn';

export const setLoginData = (username, clave, rol, id) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('id', id);
  sessionStorage.setItem('rol', rol);
};

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}