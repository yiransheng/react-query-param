"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
function gather(storage) {
  var pairs = gatherNode(storage[ROOT_QUERY_SYMBOL], storage);
  return paris.reduce(function (_ref, object) {
    var key = _ref.key,
        values = _ref.values;

    if (object[key]) {
      object[key] = [].concat(_toConsumableArray(object[key]), _toConsumableArray(values));
    } else {
      object[key] = values;
    }
    return object;
  }, {});
}

function gatherNode(node, storage) {
  if (!node) {
    return [];
  }
  var data = node.data,
      childNodes = node.childNodes;

  if (!node.parent) {
    return gatherChildren(childNodes.map(function (k) {
      return storage[k];
    }), storage);
  }
  var selfKey = data.key,
      values = data.values;

  var pairs = gatherChildren(childNodes.map(function (k) {
    return storage[k];
  }), storage).filter(function (_ref2) {
    var key = _ref2.key;
    return key !== selfKey;
  });
  pairs.push({ key: selfKey, values: values });
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
      return callback(gather(storage));
    });

    function push(key, _ref3) {
      var parent = _ref3.parent,
          data = _ref3.data;

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
      var peers = storage[storage[key].parent].childNodes;
      var index = peers.indexOf(key);
      if (index > -1) {
        peers.splice(index, 1);
      }
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
    value: function getChildContext() {
      return {
        "@@query/nodes": this._nodesApi,
        "@@query/currentKey": ROOT_QUERY_SYMBOL
      };
    }
  }, {
    key: "componentWillRecieveProps",
    value: function componentWillRecieveProps(nextProps) {
      if (this.props.onChange !== nextProps.onChange) {
        this._nodesApi = this.getNodesApi(nextProps.onChange);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.children) {
        return null;
      }
      if (_react2.default.Children.count(this.props.children) <= 1) {
        return this.props.children;
      }
      return _react2.default.createElement(
        "div",
        null,
        this.props.children
      );
    }
  }]);

  return UrlQuery;
}(_react.Component);

UrlQuery.childContextTypes = {
  "@@query/nodes": _react2.default.PropTypes.shape({
    push: _react2.default.PropTypes.func.isRequired,
    replace: _react2.default.PropTypes.func.isRequired,
    remove: _react2.default.PropTypes.func.isRequired
  }),
  "@@query/currentKey": _react2.default.PropTypes.symbol
};
exports.default = UrlQuery;