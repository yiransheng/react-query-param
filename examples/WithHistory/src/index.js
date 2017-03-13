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

const store = createStore(reducer, initialState);
const history = createHistory();

history.listen(location => {
  const { search } = location;
  if (!search) {
    return;
  }
  const query = parse(search) || {};
  switch (query.view) {
    case "home":
      store.dispatch(navigate({ route: "home" }));
      break;
    case "about":
      store.dispatch(navigate({ route: "about" }));
      break;
    case "topic":
      const id = query.id;
      if (id) {
        store.dispatch(navigate({ route: "topic", id }));
      } else {
        store.dispatch(navigate({ route: "topics" }));
      }
      break;
    default:
      store.dispatch(navigate({ route: null }));
  }
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
