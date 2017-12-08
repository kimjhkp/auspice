import queryString from "query-string";
import * as types from "../actions/types";

// eslint-disable-next-line
export const changeURLMiddleware = (store) => (next) => (action) => {
  const state = store.getState(); // this is "old" state, i.e. before the reducers have updated by this action
  const result = next(action); // send action to other middleware / reducers
  if (action.dontModifyURL !== undefined) {
    return result;
  }

  const query = queryString.parse(window.url.location.search);
  let queryModified = true;

  switch (action.type) {
    case types.NEW_COLORS:
      query.c = action.colorBy === state.controls.defaults.colorBy ? undefined : action.colorBy;
      break;
    case types.APPLY_FILTER: {
      query[`f_${action.fields}`] = action.values.join(',');
      break;
    }
    case types.CHANGE_LAYOUT: {
      query.l = action.data === state.controls.defaults.layout ? undefined : action.data;
      break;
    }
    default:
      queryModified = false;
      break;
  }

  if (queryModified) {
    Object.keys(query).filter((k) => !query[k]).forEach((k) => delete query[k]);
    const newURL = {
      pathname: window.url.location.pathname,
      search: queryString.stringify(query).replace(/%2C/g, ',')
    };
    window.url.replace(newURL);
  }

  return result;
};
