import React, {PropTypes, Component} from "react";
import { withRouter } from 'react-router'
import { replace } from "react-router-redux";
import { stringify } from "query-string";

import UrlQuery from "./UrlQuery";
import {memoize} from "./utils";

const handleChange = memoize((store) => (location) => (query) => {
  const search = '?' + stringify(query); 
  if (search !== location.search) {
    store.dispatch(replace({...location, search}));
  }
});

class ReduxUrlQuery extends Component {

  static contextTypes = {
    store: PropTypes.object
  };

  render() {
    const { store } = this.context;
    const { location } = this.props;
    return (
      <UrlQuery onChange={handleChange(store)(location)}>
        {this.props.children}
      </UrlQuery>
    );
  }
}

export default withRouter(ReduxUrlQuery);
