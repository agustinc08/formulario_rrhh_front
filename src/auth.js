const AUTH_TOKEN_KEY = 'isLoggedIn';

export const setLoginData = (rol) => {
  localStorage.setItem(AUTH_TOKEN_KEY, 'true');
  localStorage.setItem('rol', rol);
};

export const getDependenciaId = () => {
  return localStorage.getItem('dependenciaId');
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}