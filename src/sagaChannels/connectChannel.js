import {
  buffers,
  eventChannel,
} from 'redux-saga';
import SocketClusterClient from 'socketcluster-client';

function createConnectionChannel(options, label) {
  return eventChannel(
    (emitter) => {
      const socket = SocketClusterClient.connect({
        autoConnect: false,
        ...options,
      });
      emitter({
        event: 'created',
        socket,
        label,
      });
      socket.on('connecting', () => {
        const event = 'connecting';
        emitter({ event, label, socket });
      });
      socket.on('connect', (status, processSubscriptions) => {
        const event = 'connect';
        emitter({ event, label, socket, status, processSubscriptions });
      });
      socket.on('disconnect', () => {
        const event = 'disconnect';
        emitter({ event, label, socket });
      });
      socket.on('error', (error) => {
        const event = 'error';
        emitter({ event, label, socket, error });
      });
      socket.on('message', (msg) => {
        const event = 'message';
        let message;
        try {
          message = JSON.parse(msg);
        } catch (error) {
          message = null;
        }
        if (message && message.event) {
          emitter({ event, label, socket, message });
        }
      });
      if (!options.autoConnect) {
        socket.connect();
      }
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, buffers.sliding(4));
}

export default createConnectionChannel;
