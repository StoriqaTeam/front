import { defaultTo, pathOr } from 'ramda';

export const DUMMY_STORE_CHANGE_STARTED = 'dummyStore/CHANGE_STARTED';
export const DUMMY_STORE_CHANGE_FINISHED = 'dummyStore/CHANGE_FINISHED';

const defaultValue = defaultTo('default dummy value');

const initialState = {
  value: defaultValue(null),
  inChanging: false,
};

const dummyReducer = (state = initialState, action) => {
  switch (action.type) {
    case DUMMY_STORE_CHANGE_STARTED:
      return {
        ...state,
        inChanging: true,
      };
    case DUMMY_STORE_CHANGE_FINISHED:
      return {
        ...state,
        inChanging: false,
        value: pathOr(null, ['payload', 'value'], action),
      };
    default:
      return state;
  }
};

// "async"
export const changeWithValue = value => (dispatch) => {
  dispatch({ type: DUMMY_STORE_CHANGE_STARTED });

  return setTimeout(() => {
    dispatch({
      type: DUMMY_STORE_CHANGE_FINISHED,
      payload: {
        value: defaultValue(value),
      },
    });
  }, 500);
};

export default dummyReducer;
