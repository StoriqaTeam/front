import { combineReducers } from 'redux';

import found from './found';
import dummy from './dummy';

const rootReducer = combineReducers({
  found,
  dummy, // example reducer
});

const createReducers = () => rootReducer;

export default createReducers;
