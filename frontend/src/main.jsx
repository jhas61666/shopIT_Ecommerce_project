import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from "react-redux";
import store from './redux/store.js';

/**
 * Filter out the MDBootstrap defaultProps warnings.
 * This is necessary because mdbreact uses deprecated React patterns 
 * that the library maintainers haven't updated yet.
 */
const backupError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed')) {
    return;
  }
  backupError(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);