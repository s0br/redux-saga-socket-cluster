import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { socketSaga } from 'redux-saga-socket-cluster';
import reducers from './reducers';

const defaultState = {};

const sagaMiddleware = createSagaMiddleware();

console.log('creating store');

const store = createStore(
  reducers, defaultState, applyMiddleware(logger, sagaMiddleware));

sagaMiddleware.run(socketSaga);

export default store;
