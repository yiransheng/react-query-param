import { LOCATION_CHANGE, routerReducer } from "react-router-redux";

const defaultState = { router: { location: null } };

export default function liftReducer(reducer, mapLocationToActions = () => []) {
  return (state = defaultState, action) => {
    if (action.type === LOCATION_CHANGE) {
      const actions = mapLocationToActions(action.payload);
      const nextState = actions.reduce(reducer, state);
      const router = routerReducer(state.router, action);
      return { ...nextState, router };
    }
    return reducer(state, action);
  };
}
