import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppRoutes from 'routes';
import store from 'store';

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
