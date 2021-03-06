import PropTypes from "prop-types";
import React, { Component } from "react";
import { flatMap, oncePerTick, renderChildren } from "./utils";

const ROOT_QUERY_SYMBOL = Symbol("root-query");

function getInitialNodes() {
  const storage = Object.create(null);
  storage[ROOT_QUERY_SYMBOL] = {
    childNodes: [],
    parent: null,
    data: null
  };
  return storage;
}
// Map<Symbol, NodeData> -> Shape({ [String] : [String] })
//   where NodeData :: Shape({ childNodes : [Symbol], parent: Symbol, data: Object })
function gather(storage) {
  const pairs = gatherNode(storage[ROOT_QUERY_SYMBOL], storage);
  return pairs.reduce(
    (object, { key, values }) => {
      if (!key || !values.length) {
        return object;
      }
      if (object[key]) {
        object[key] = [...object[key], ...values];
      } else {
        object[key] = values;
      }
      if (object[key].length === 1) {
        object[key] = object[key][0];
      }
      return object;
    },
    {}
  );
}

function gatherNode(node, storage) {
  if (!node) {
    return [];
  }
  const { data, childNodes } = node;
  if (!node.parent) {
    return gatherChildren(childNodes.map(k => storage[k]), storage);
  }
  const { key: selfKey, values } = data;
  const pairs = gatherChildren(childNodes.map(k => storage[k]), storage);
  if (selfKey && values.length && pairs.every(({ key }) => key !== selfKey)) {
    pairs.push({ key: selfKey, values });
  }
  return pairs;
}

function gatherChildren(childNodes, storage) {
  return flatMap(childNodes, n => gatherNode(n, storage));
}

// end gather

const nodesApi = (storage = getInitialNodes()) => callback => {
  const runChange = oncePerTick(() => {
    callback(gather(storage));
  });

  function push(key, { parent, data }) {
    if (storage[key]) {
      storage[key] = { ...storage[key], data, parent };
    } else {
      storage[key] = { data, parent, childNodes: [] };
    }
    if (storage[parent]) {
      storage[parent].childNodes.push(key);
    } else {
      storage[parent] = { childNodes: [key] };
    }
    runChange();
  }
  function replace(key, data) {
    storage[key] = { ...storage[key], data };
    runChange();
  }
  function remove(key) {
    if (!storage[key]) {
      return;
    }
    const parent = storage[storage[key].parent];
    if (parent) {
      const peers = parent.childNodes;
      const index = peers.indexOf(key);
      if (index > -1) {
        peers.splice(index, 1);
      }
    }
    storage[key].childNodes.forEach(remove);
    delete storage[key];
    runChange();
  }

  return {
    push,
    replace,
    remove
  };
};

export default class UrlQuery extends Component {
  static childContextTypes = {
    "@@query/nodes": PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired
    }),
    "@@query/currentKey": PropTypes.symbol
  };

  constructor(props) {
    super(props);
    this.getNodesApi = nodesApi();
    this._nodesApi = this.getNodesApi(props.onChange);
  }

  getChildContext() {
    return {
      "@@query/nodes": this._nodesApi,
      "@@query/currentKey": ROOT_QUERY_SYMBOL
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.onChange !== nextProps.onChange) {
      this._nodesApi = this.getNodesApi(nextProps.onChange);
    }
  }

  render() {
    return renderChildren(this.props.children);
  }
}
