import React, { Component } from "react";
import shallowEqual from "recompose/shallowEqual";
import getContext from "recompose/getContext";

import { flatMap, uid, normalizeQueryValues } from "./utils";

const makeNode = (parentKey, data) => {
  return {
    parent: parentKey,
    data
  };
};

@getContext({
  "@@query/nodes": React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    remove: React.PropTypes.func.isRequired
  }),
  "@@query/currentKey": React.PropTypes.symbol
})
export default class QueryParam extends Component {
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
        values: normalizeQueryValues(this.props.values)
      })
    );
  }
  componentWillReceiveProps(nextProps) {
    const { values: vals1, ...props1 } = this.props;
    const { values: vals2, ...props2 } = nextProps;
    if (shallowEqual(props1, props2) && shallowEqual(vals1, vals2)) {
      return;
    }
    const nodes = nextProps["@@query/nodes"];
    nodes.replace(this._key, {
      key: nextProps.name,
      values: normalizeQueryValues(this.props.values)
    });
  }
  componentWillUnmount() {
    const nodes = this.props["@@query/nodes"];
    nodes.remove(this._key);
  }

  render() {
    if (!this.props.children) {
      return null;
    }
    if (React.Children.count(this.props.children) <= 1) {
      return this.props.children;
    }
    return <div>{this.props.children}</div>;
  }
}
