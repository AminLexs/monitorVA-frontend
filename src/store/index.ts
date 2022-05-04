import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'handlers';
import { createBrowserHistory } from 'history';

const initialState = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')!) : {};

export const history = createBrowserHistory();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

export default store;
