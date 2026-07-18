import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import App from './app/App';
import { Loading } from './pages/loading/loading.component';

/* used for testing */
declare global {
  interface Window {
    store: typeof store;
    Cypress: Cypress.Cypress;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

/* used for testing */
if (window.Cypress) {
  window.store = store;
}
