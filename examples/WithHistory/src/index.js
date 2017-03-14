import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./App";
import reducer, { initialState } from "./reducer";
import { navigate } from "./actions";
import createHistory from "history/createBrowserHistory";
import { stringify, parse } from "query-string";

import { UrlQuery } from "react-url-param";

const locationToAction = location => {
  const { search } = location;
  if (!search) {
    return;
  }
  const query = parse(search) || {};
  switch (query.view) {
    case "home":
      return navigate({ route: "home" });
      break;
    case "about":
      return navigate({ route: "about" });
      break;
    case "topic":
      return navigate({ route: "topics" });
      break;
    case "topic-detail":
      const id = query.topic;
      return navigate({ route: "topic", id });
      break;
    default:
      return navigate({ route: null });
  }
};

const history = createHistory();
const initialStateWithView = reducer(
  initialState,
  locationToAction(history.location)
);
const store = createStore(reducer, initialStateWithView);

history.listen(location => {
  store.dispatch(locationToAction(location));
});

const queryChanged = query => {
  const { location } = history;
  const newLocation = {
    ...location,
    search: stringify(query)
  };
  history.push(newLocation);
};

ReactDOM.render(
  <Provider store={store}>
    <UrlQuery onChange={queryChanged}>
      <App />
    </UrlQuery>
  </Provider>,
  document.getElementById("root")
);
