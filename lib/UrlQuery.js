"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ROOT_QUERY_SYMBOL = Symbol("root-query");

function getInitialNodes() {
  var storage = Object.create(null);
  storage[ROOT_QUERY_SYMBOL] = {
    childNodes: [],
    parent: null,
    data: null
  };
  return storage;
}
// Map<Symbol, NodeData> -> Shape({ [String] : [String] })
//   where NodeData :: Shape({ childNodes : [Symbol], parent: Symbol, data: Object })

function _ref2(object, _ref) {
  var key = _ref.key,
      values = _ref.values;

  if (!key || !values.length) {
    return object;
  }
  if (object[key]) {
    object[key] = [].concat(_toConsumableArray(object[key]), _toConsumableArray(values));
  } else {
    object[key] = values;
  }
  if (object[key].length === 1) {
    object[key] = object[key][0];
  }
  return object;
}

function gather(storage) {
  var pairs = gatherNode(storage[ROOT_QUERY_SYMBOL], storage);
  return pairs.reduce(_ref2, {});
}

function gatherNode(node, storage) {
  if (!node) {
    return [];
  }
  var data = node.data,
      childNodes = node.childNodes;

  function _ref3(k) {
    return storage[k];
  }

  if (!node.parent) {
    return gatherChildren(childNodes.map(_ref3), storage);
  }
  var selfKey = data.key,
      values = data.values;

  var pairs = gatherChildren(childNodes.map(function (k) {
    return storage[k];
  }), storage);
  if (selfKey && values.length && pairs.every(function (_ref4) {
    var key = _ref4.key;
    return key !== selfKey;
  })) {
    pairs.push({ key: selfKey, values: values });
  }
  return pairs;
}

function gatherChildren(childNodes, storage) {
  return (0, _utils.flatMap)(childNodes, function (n) {
    return gatherNode(n, storage);
  });
}

// end gather

var nodesApi = function nodesApi() {
  var storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getInitialNodes();
  return function (callback) {
    var runChange = (0, _utils.oncePerTick)(function () {
      callback(gather(storage));
    });

    function push(key, _ref5) {
      var parent = _ref5.parent,
          data = _ref5.data;

      if (storage[key]) {
        storage[key] = _extends({}, storage[key], { data: data, parent: parent });
      } else {
        storage[key] = { data: data, parent: parent, childNodes: [] };
      }
      if (storage[parent]) {
        storage[parent].childNodes.push(key);
      } else {
        storage[parent] = { childNodes: [key] };
      }
      runChange();
    }
    function replace(key, data) {
      storage[key] = _extends({}, storage[key], { data: data });
      runChange();
    }
    function remove(key) {
      if (!storage[key]) {
        return;
      }
      var parent = storage[storage[key].parent];
      if (parent) {
        var peers = parent.childNodes;
        var index = peers.indexOf(key);
        if (index > -1) {
          peers.splice(index, 1);
        }
      }
      storage[key].childNodes.forEach(remove);
      delete storage[key];
      runChange();
    }

    return {
      push: push,
      replace: replace,
      remove: remove
    };
  };
};

function _getChildContext() {
  return {
    "@@query/nodes": this._nodesApi,
    "@@query/currentKey": ROOT_QUERY_SYMBOL
  };
}

function _componentWillReceive(nextProps) {
  if (this.props.onChange !== nextProps.onChange) {
    this._nodesApi = this.getNodesApi(nextProps.onChange);
  }
}

function _render() {
  return (0, _utils.renderChildren)(this.props.children);
}

var UrlQuery = function (_Component) {
  _inherits(UrlQuery, _Component);

  function UrlQuery(props) {
    _classCallCheck(this, UrlQuery);

    var _this = _possibleConstructorReturn(this, (UrlQuery.__proto__ || Object.getPrototypeOf(UrlQuery)).call(this, props));

    _this.getNodesApi = nodesApi();
    _this._nodesApi = _this.getNodesApi(props.onChange);
    return _this;
  }

  _createClass(UrlQuery, [{
    key: "getChildContext",
    value: _getChildContext
  }, {
    key: "componentWillReceiveProps",
    value: _componentWillReceive
  }, {
    key: "render",
    value: _render
  }]);

  return UrlQuery;
}(_react.Component);

UrlQuery.childContextTypes = {
  "@@query/nodes": _propTypes2.default.shape({
    push: _propTypes2.default.func.isRequired,
    replace: _propTypes2.default.func.isRequired,
    remove: _propTypes2.default.func.isRequired
  }),
  "@@query/currentKey": _propTypes2.default.symbol
};
exports.default = UrlQuery;