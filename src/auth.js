const AUTH_TOKEN_KEY = 'isLoggedIn';

export const login = () => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isLoggedIn = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}