import {
  SOCKET_CREATED,
  SOCKET_CONNECTING,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  SOCKET_MESSAGE,
  SOCKET_MESSAGE_SENT,
  SOCKET_ERROR,
  CHANNEL_SUBSCRIBED,
  CHANNEL_UNSUBSCRIBED,
  CHANNEL_STATE_CHANGED,
  CHANNEL_PUBLISHED,
  CHANNEL_MESSAGE,
} from './actions';

function singleChannelReducer(channel, state = {
  name: '',
  state: 'subscribed',
  receivedMessages: [],
  sentMessages: [],
}, action) {
  switch (action.type) {
    case CHANNEL_STATE_CHANGED:
      return {
        ...state,
        name: channel,
        state: action.state,
      };
    case CHANNEL_PUBLISHED:
      return {
        ...state,
        sentMessages: [
          ...state.sentMessages,
          action.data,
        ],
      };
    case CHANNEL_MESSAGE:
      return {
        ...state,
        receivedMessages: [
          ...state.receivedMessages,
          action.data,
        ],
      };
    default:
      return state;
  }
}

function channelsReducer(state = {}, action) {
  const { channel } = action;
  return {
    ...state,
    [channel]: singleChannelReducer(channel, state[channel], action),
  };
}

function socketsReducer(state = {}, action) {
  switch (action.type) {
    case SOCKET_CREATED:
      return {
        ...state,
        [action.label]: {
          state: action.state,
          historySize: {
            received: 10,
            sent: 5,
          },
          receivedMessages: {},
          sentMessages: [],
          channels: {},
        },
      };
    case SOCKET_CONNECTED:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          state: 'open',
        },
      };
    case SOCKET_DISCONNECTED:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          state: 'closed',
        },
      };
    case SOCKET_CONNECTING:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          state: 'connecting',
        },
      };
    case SOCKET_MESSAGE:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          receivedMessages: {
            ...state[action.label].receivedMessages,
            [action.message.event]: [
              action.message.data,
              ...(state[action.label].receivedMessages[action.message.event] || []),
            ].slice(0, state[action.label].historySize.received),
          },
        },
      };
    case SOCKET_MESSAGE_SENT:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          sentMessages: [
            ...state[action.label].sentMessages,
            {
              event: action.event,
              data: action.data,
            },
          ].slice(0, state[action.label].historySize.sent),
        },
      };
    case SOCKET_ERROR: {
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          state: 'error',
          error: action.error,
        },
      };
    }
    case CHANNEL_SUBSCRIBED:
    case CHANNEL_UNSUBSCRIBED:
    case CHANNEL_STATE_CHANGED:
    case CHANNEL_PUBLISHED:
    case CHANNEL_MESSAGE:
      return {
        ...state,
        [action.label]: {
          ...state[action.label],
          channels: channelsReducer(state[action.label].channels, action),
        },
      };
    default:
      return state;
  }
}

export default socketsReducer;
