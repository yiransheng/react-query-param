import React, {PropTypes, Component} from "react";
import { withRouter } from 'react-router'
import { replace } from "react-router-redux";
import { stringify } from "query-string";

import UrlQuery from "./UrlQuery";
import {memoize} from "./utils";

const handleChange = memoize((store) => (query) => {
  const state = store.getState();
  if (!state || !state.router || !state.router.location) {
    return;
  }
  const location = state.router.location
  const search = '?' + stringify(query); 
  if (search !== location.search) {
    store.dispatch(replace({...location, method:"REPLACE", search}));
  }
});

export default class ReduxUrlQuery extends Component {

  static contextTypes = {
    store: PropTypes.object
  };

  render() {
    const { store } = this.context;
    return (
      <UrlQuery onChange={handleChange(store)}>
        {this.props.children}
      </UrlQuery>
    );
  }
}
