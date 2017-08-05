/* eslint-disable import/prefer-default-export */
import { call, take, put } from 'redux-saga/effects';
import {
  EVENT_CREATED,
  EVENT_CONNECT,
  EVENT_DISCONNECT,
  EVENT_MESSAGE,
  EVENT_ERROR,
  EVENT_CONNECTING,
  EVENT_CHANGE,
  connectChannel,
  subscribeChannel,
  publishChannel,
} from './sagaChannels';
import {
  SOCKET_CREATED,
  SOCKET_CONNECTING,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  SOCKET_ERROR,
  SOCKET_MESSAGE,
  SOCKET_MESSAGE_SENT,
  CHANNEL_STATE_CHANGED,
  CHANNEL_MESSAGE,
  CHANNEL_PUBLISHED,
  CHANNEL_PUBLISH_ERROR,
} from './actions';
import socketStore from './socketStore';

function findSocket(label) {
  return new Promise((resolve, reject) => {
    const socket = socketStore.get(label);
    if (socket !== undefined) {
      resolve(socket);
    } else {
      reject(`Unable to find socket ${label}`);
    }
  });
}

export function* connect(action) {
  const { options, label: newSocketLabel } = action;
  const prevSocket = socketStore.get(newSocketLabel);
  if (!prevSocket) {
    const channel = yield call(connectChannel, options, newSocketLabel);
    while (true) {
      // Here is where the magic happens
      const {
        event,
        label,
        socket,
        state,
        error,
        message,
      } = yield take(channel);
      switch (event) {
        case EVENT_CREATED:
          socketStore.set(label, socket);
          yield put({
            type: SOCKET_CREATED,
            state: socket.getState(),
            label,
          });
          break;
        case EVENT_CONNECT:
          yield put({
            type: SOCKET_CONNECTED,
            state,
            label,
          });
          break;
        case EVENT_CONNECTING:
          yield put({
            type: SOCKET_CONNECTING,
            label,
          });
          break;
        case EVENT_MESSAGE:
          yield put({
            type: SOCKET_MESSAGE,
            message,
            label,
          });
          break;
        case EVENT_DISCONNECT:
          yield put({
            type: SOCKET_DISCONNECTED,
            label,
          });
          break;
        case EVENT_ERROR:
          yield put({
            type: SOCKET_ERROR,
            error,
            label,
          });
          break;
        default:
          console.warn(`Unhandled socket event ${event}`);
      }
    }
  } else {
    yield call(() => {
      prevSocket.connect();
    });
  }
}

export function* disconnect(action) {
  const { label } = action;
  try {
    const socket = yield call(() => findSocket(label));
    socket.disconnect();
  } catch (error) {
    yield put({
      type: SOCKET_ERROR,
      label,
      error: new Error(`Unable to find socket ${label}`),
    });
  }
}

export function* emit(action) {
  const { label, event, data, callback } = action;
  const socket = socketStore.get(label);
  if (!socket) {
    yield put({
      type: SOCKET_ERROR,
      label,
      error: new Error(`Unable to find socket ${label}`),
    });
  } else {
    socket.emit(event, data, callback);
    yield put({
      type: SOCKET_MESSAGE_SENT,
      event,
      data,
      label,
    });
  }
}

export function* subscribe(action) {
  const {
    label,
    options,
    channel: channelName,
  } = action;

  try {
    const socket = yield call(() => findSocket(label));
    const socketChannel = socket.channel(channelName);
    if (!socketChannel.isSubscribed()) {
      const channel = yield call(subscribeChannel, socket, channelName, options);
      while (true) {
        const { event, data, state } = yield take(channel);
        switch (event) {
          case EVENT_CHANGE:
            yield put({
              type: CHANNEL_STATE_CHANGED,
              label,
              channel: channelName,
              state,
            });
            break;
          case EVENT_MESSAGE:
            yield put({
              type: CHANNEL_MESSAGE,
              label,
              data,
              channel: channelName,
            });
            break;
          default:
            break;
        }
      }
    } else {
      yield put({
        type: CHANNEL_STATE_CHANGED,
        label,
        channel: channelName,
        state: 'subscribed',
      });
    }
  } catch (error) {
    yield put({
      type: SOCKET_ERROR,
      label,
      error,
    });
  }
}

export function* unsubscribe(action) {
  const {
    label,
    channel: channelName,
  } = action;

  try {
    const socket = yield call(() => findSocket(label));
    socket.unsubscribe(channelName);
  } catch (error) {
    yield put({
      type: SOCKET_ERROR,
      label,
      error,
    });
  }
}

export function* publish(action) {
  const {
    label,
    channel: channelName,
    data,
  } = action;

  try {
    const socket = yield call(() => findSocket(label));
    const socketChannel = socket.channel(channelName);
    if (!socketChannel.isSubscribed()) {
      throw new Error(`Socket ${label} not subscribed to channel ${channelName}. Please, subscribe to channel first`);
    }
    const channel = yield call(publishChannel, socket, channelName, data);
    try {
      const { error } = yield take(channel);
      if (error) {
        yield put({
          type: CHANNEL_PUBLISH_ERROR,
          label,
          channel: channelName,
          error,
        });
      } else {
        yield put({
          type: CHANNEL_PUBLISHED,
          label,
          channel: channelName,
          data,
        });
      }
    } finally {
      console.log('Message published');
    }
  } catch (error) {
    yield put({
      type: SOCKET_ERROR,
      label,
      channelName,
      error,
    });
  }
}
