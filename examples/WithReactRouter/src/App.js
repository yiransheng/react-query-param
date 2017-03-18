import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createLogger from "redux-logger";
import { Route, Link } from "react-router-dom";
import { QueryParam } from "react-url-param";
import ReduxUrlQuery from "react-url-param/ReduxUrlQuery";
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  push
} from "react-router-redux";
import Styletron from "styletron-client";
import { StyletronProvider } from "styletron-react";
import { isEmpty, memoize } from "lodash";
import { parse, stringify } from "query-string";
import compose from "recompose/compose";
import withState from "recompose/withState";
import withProps from "recompose/withProps";
import withHandlers from "recompose/withHandlers";

import rootReducer, { getInitialState } from "./ducks";

import Flex from "./Flex";
import Messages from "./Messages";
import MessageDetail from "./MessageDetail";
import Sidebar from "./Sidebar";
import Filters from "./Filters";

const history = createBrowserHistory();

const store = createStore(
  rootReducer,
  getInitialState(history.location),
  applyMiddleware(createLogger(), routerMiddleware(history))
);

const App = () => {
  return (
    <Provider store={store}>
      <StyletronProvider styletron={new Styletron()}>
        <ConnectedRouter history={history}>
          <ReduxUrlQuery>
            <Flex>
              <Sidebar />
              <Route path="/:id" render={({match}) => {
                return <MessageDetail id={match.params.id} />
              }}/>
              <Route exact path="/" component={Messages} /> 
            </Flex>
          </ReduxUrlQuery>
        </ConnectedRouter>
      </StyletronProvider>
    </Provider>
  );
};

export default App;
