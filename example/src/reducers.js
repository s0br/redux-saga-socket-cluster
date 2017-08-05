import { combineReducers } from 'redux';
import { socketReducer } from 'redux-saga-socket-cluster';

function sampleReducer(state = {
  lastEvent: null,
}, action) {
  if (action.type.startsWith('@@socketcluster')) {
    return {
      lastEvent: action.type,
    };
  }
  return state;
}

const rootReducer = combineReducers({
  sampleReducer,
  socketcluster: socketReducer,
});

export default rootReducer;
