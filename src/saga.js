import { END } from 'redux-saga';
import { fork, take } from 'redux-saga/effects';

import {
  SOCKET_CONNECT,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECT,
  SOCKET_DISCONNECTED,
  SOCKET_ERROR,
  SOCKET_EMIT,
  CHANNEL_SUBSCRIBE,
  CHANNEL_UNSUBSCRIBE,
  CHANNEL_PUBLISH,
  CHANNEL_DESTROY,
} from './actions';
import * as sagas from './socketSagas';

function* socketSaga() {
  let action;
  do {
    action = yield take('*');
    let saga;
    switch (action.type) {
      case SOCKET_CONNECT:
        saga = sagas.connect;
        break;
      case SOCKET_DISCONNECT:
        saga = sagas.disconnect;
        break;
      case SOCKET_EMIT:
        saga = sagas.emit;
        break;
      case CHANNEL_SUBSCRIBE:
        saga = sagas.subscribe;
        break;
      case CHANNEL_UNSUBSCRIBE:
        saga = sagas.unsubscribe;
        break;
      case CHANNEL_PUBLISH:
        saga = sagas.publish;
        break;
      case CHANNEL_DESTROY:
      default:
        saga = null;
    }
    if (saga) {
      yield fork(saga, action);
    }
  } while (action !== END);
}

function* rootSocketSaga() {
  yield fork(socketSaga);
}

export default rootSocketSaga;
