export const SOCKET_DEFAULT_LABEL = '@@socketcluster/default-socket';
export const SOCKET_CREATED = '@@socketcluster/socket-created';
export const SOCKET_CONNECT = '@@socketcluster/connect';
export const SOCKET_CONNECTING = '@@socketcluster/connecting';
export const SOCKET_CONNECTED = '@@socketcluster/connected';
export const SOCKET_DISCONNECT = '@@socketcluster/disconnect';
export const SOCKET_DISCONNECTED = '@@socketcluster/disconnected';
export const SOCKET_MESSAGE = '@@socketcluster/message';
export const SOCKET_MESSAGE_SENT = '@@socketcluster/message-sent';
export const SOCKET_ERROR = '@@socketcluster/error';
export const SOCKET_EMIT = '@@socketcluster/emit';

export const CHANNEL_SUBSCRIBE = '@@socketcluster/subscribe';
export const CHANNEL_UNSUBSCRIBE = '@@socketcluster/unsubscribe';
export const CHANNEL_SUBSCRIBED = '@@socketcluster/subscribed';
export const CHANNEL_UNSUBSCRIBED = '@@socketcluster/unsubscribed';
export const CHANNEL_STATE_CHANGED = '@@socketcluster/channelStateChanged';
export const CHANNEL_MESSAGE = '@@socketcluster/channel-message';
export const CHANNEL_PUBLISH = '@@socketcluster/publish';
export const CHANNEL_PUBLISHED = '@@socketcluster/published';
export const CHANNEL_PUBLISH_ERROR = '@@socketcluster/publish-error';
export const CHANNEL_DESTROY = '@@socketcluster/channel-destroy';

export function connect(options, label = SOCKET_DEFAULT_LABEL) {
  return {
    type: SOCKET_CONNECT,
    options,
    label,
  };
}

export function disconnect(label = SOCKET_DEFAULT_LABEL) {
  return {
    type: SOCKET_DISCONNECT,
    label,
  };
}

export function emit(event, data, callback = null, label = SOCKET_DEFAULT_LABEL) {
  return {
    type: SOCKET_EMIT,
    event,
    data,
    callback,
    label,
  };
}

export function subscribe(channel, options, label = SOCKET_DEFAULT_LABEL) {
  return {
    type: CHANNEL_SUBSCRIBE,
    channel,
    options,
    label,
  };
}

export function unsubscribe(channel, label = SOCKET_DEFAULT_LABEL) {
  return {
    type: CHANNEL_UNSUBSCRIBE,
    channel,
    label,
  };
}

export function publish(channel, data, label = SOCKET_DEFAULT_LABEL) {
  return {
    type: CHANNEL_PUBLISH,
    channel,
    data,
    label,
  };
}
