import {
  buffers,
  eventChannel,
} from 'redux-saga';

function createSuscriptionChannel(socket, channelName, options) {
  return eventChannel(
    (emitter) => {
      const channel = socket.subscribe(channelName, options);
      channel.watch((data) => {
        emitter({ channel: channelName, data, event: 'message' });
      });
      channel.on('subscribeFail', (error) => {
        emitter({ channel: channelName, event: 'error', error });
      });
      channel.on('subscribeStateChange', ({ newState }) => {
        emitter({ channel: channelName, event: 'change', state: newState });
      });
      return () => {
        channel.unsubscribe();
      };
    }, buffers.sliding(2));
}

export default createSuscriptionChannel;
