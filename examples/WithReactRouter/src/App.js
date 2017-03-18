import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import createBrowserHistory from "history/createBrowserHistory";
import { Route, Link } from "react-router-dom";
import { QueryParam } from "react-url-param";
import ReduxUrlQuery from "react-url-param/lib/ReduxUrlQuery";
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  push
} from "react-router-redux";
import { isEmpty, memoize } from "lodash";
import { parse, stringify } from "query-string";
import compose from "recompose/compose";
import withState from "recompose/withState";
import withProps from "recompose/withProps";
import withHandlers from "recompose/withHandlers";

import rootReducer, { getInitialState } from "./ducks";

const history = createBrowserHistory();

const store = createStore(rootReducer, getInitialState(history.location));

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ReduxUrlQuery>
          <div />
        </ReduxUrlQuery>
      </ConnectedRouter>
    </Provider>
  );
};
