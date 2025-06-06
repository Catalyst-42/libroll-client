import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

let token = localStorage.getItem('token');
try {
  jwtDecode(token);
} catch {
  token = null;
  localStorage.removeItem('token');
}

const initialState = {
  token,
  isAuthenticated: !!token && jwtDecode(token).exp > Date.now() / 1000,
};

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
