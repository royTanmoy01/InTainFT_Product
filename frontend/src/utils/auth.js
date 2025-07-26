// Store token and refreshToken with expiry
export const setToken = (token, refreshToken, expiresIn = 900) => {
  const expiry = Date.now() + expiresIn * 1000;
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('tokenExpiry', expiry);
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  const expiry = parseInt(localStorage.getItem('tokenExpiry'), 10);
  if (!token || !expiry || Date.now() > expiry) return null;
  return token;
};

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};
