import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Route } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import { QueryParam } from "react-url-param";
import { ConnectedUrlQuery } from "react-url-param/react-router-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import createLogger from "redux-logger";
import Styletron from "styletron-client";
import { StyletronProvider } from "styletron-react";

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
          <ConnectedUrlQuery>
            <Flex>
              <Sidebar />
              <Route
                path="/:id"
                render={({ match }) => {
                  return <MessageDetail id={match.params.id} />;
                }}
              />
              <Route exact path="/" component={Messages} />
            </Flex>
          </ConnectedUrlQuery>
        </ConnectedRouter>
      </StyletronProvider>
    </Provider>
  );
};

export default App;
