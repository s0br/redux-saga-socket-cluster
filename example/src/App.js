import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import SocketExample from './SocketExample';

function App() {
  return (
    <Provider store={store}>
      <SocketExample />
    </Provider>
  );
}

export default App;
