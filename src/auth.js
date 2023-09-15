const AUTH_TOKEN_KEY = 'isLoggedIn';

export const setLoginData = (rol) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
  sessionStorage.setItem('rol', rol);
};

export const getDependenciaId = () => {
  return sessionStorage.getItem('dependenciaId');
};

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}