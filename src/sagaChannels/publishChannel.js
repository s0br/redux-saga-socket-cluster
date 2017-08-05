import {
  buffers,
  eventChannel,
  END,
} from 'redux-saga';

function createPublishChannel(socket, channelName, data) {
  return eventChannel(
    (emitter) => {
      socket.publish(channelName, data, (error) => {
        emitter({ error });
        emitter(END);
      });
      return () => {
      };
    }, buffers.sliding(1));
}

export default createPublishChannel;
