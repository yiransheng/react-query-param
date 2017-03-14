import React, { Component } from "react";
import compose from "recompose/compose";
import shallowEqual from "recompose/shallowEqual";
import getContext from "recompose/getContext";
import withProps from "recompose/withProps";

import {
  flatMap,
  uid,
  normalizeQueryValues,
  arrayShallowEqual,
  renderChildren
} from "./utils";

const makeNode = (parentKey, data) => {
  return {
    parent: parentKey,
    data
  };
};

const QueryParam = compose(
  getContext({
    "@@query/nodes": React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
      replace: React.PropTypes.func.isRequired,
      remove: React.PropTypes.func.isRequired
    }),
    "@@query/currentKey": React.PropTypes.symbol
  }),
  withProps(props => {
    if (props.name && typeof props.name === "string") {
      return {
        values: normalizeQueryValues(props.values)
      };
    } else {
      return {
        name: "",
        values: []
      };
    }
  })
)(
  class extends Component {
    static displayName = "QueryParam";
    static childContextTypes = {
      "@@query/currentKey": React.PropTypes.symbol
    };
    constructor(props) {
      super(props);
      this._key = uid();
    }

    getChildContext() {
      return {
        "@@query/currentKey": this._key
      };
    }

    componentDidMount() {
      const parentKey = this.props["@@query/currentKey"];
      const nodes = this.props["@@query/nodes"];
      nodes.push(
        this._key,
        makeNode(parentKey, {
          key: this.props.name,
          values: this.props.values
        })
      );
    }
    componentDidUpdate(prevProps) {
      const { values: vals1, ...props1 } = this.props;
      const { values: vals2, ...props2 } = prevProps;
      if (shallowEqual(props1, props2) && arrayShallowEqual(vals1, vals2)) {
        return;
      }
      const nodes = this.props["@@query/nodes"];
      nodes.replace(this._key, {
        key: this.props.name,
        values: this.props.values
      });
    }
    componentWillUnmount() {
      const nodes = this.props["@@query/nodes"];
      nodes.remove(this._key);
    }

    render() {
      return renderChildren(this.props.children); 
    }
  }
);

export default QueryParam;
