import React from 'react';
// @ts-ignore
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppRoutes from 'routes';
import store from 'store';

import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

window.addEventListener('error', (event) => {
  console.log(event.message);
});
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.log(event.reason.message);
});

root.render(
  //<React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </Provider>,
  //</React.StrictMode>,
);
// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root'),
// );
