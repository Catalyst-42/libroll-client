import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');
const initialState = {
  token: token,
  isAuthenticated: !!token && !isTokenExpired(token),
};

function isTokenExpired(token) {
  if (!token) return true;
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
