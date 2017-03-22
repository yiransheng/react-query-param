"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _compose = require("recompose/compose");

var _compose2 = _interopRequireDefault(_compose);

var _shallowEqual = require("recompose/shallowEqual");

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _getContext = require("recompose/getContext");

var _getContext2 = _interopRequireDefault(_getContext);

var _withProps = require("recompose/withProps");

var _withProps2 = _interopRequireDefault(_withProps);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var makeNode = function makeNode(parentKey, data) {
  return {
    parent: parentKey,
    data: data
  };
};

function _getChildContext() {
  return {
    "@@query/currentKey": this._key
  };
}

function _componentDidMount() {
  var parentKey = this.props["@@query/currentKey"];
  var nodes = this.props["@@query/nodes"];
  nodes.push(this._key, makeNode(parentKey, {
    key: this.props.name,
    values: this.props.values
  }));
}

function _componentDidUpdate(prevProps) {
  var _props = this.props,
      vals1 = _props.values,
      props1 = _objectWithoutProperties(_props, ["values"]);

  var vals2 = prevProps.values,
      props2 = _objectWithoutProperties(prevProps, ["values"]);

  if ((0, _shallowEqual2.default)(props1, props2) && (0, _utils.arrayShallowEqual)(vals1, vals2)) {
    return;
  }
  var nodes = this.props["@@query/nodes"];
  nodes.replace(this._key, {
    key: this.props.name,
    values: this.props.values
  });
}

function _componentWillUnmount() {
  var nodes = this.props["@@query/nodes"];
  nodes.remove(this._key);
}

function _render() {
  return (0, _utils.renderChildren)(this.props.children);
}

var QueryParam = (0, _compose2.default)((0, _getContext2.default)({
  "@@query/nodes": _react2.default.PropTypes.shape({
    push: _react2.default.PropTypes.func.isRequired,
    replace: _react2.default.PropTypes.func.isRequired,
    remove: _react2.default.PropTypes.func.isRequired
  }),
  "@@query/currentKey": _react2.default.PropTypes.symbol
}), (0, _withProps2.default)(function (props) {
  if (props.name && typeof props.name === "string") {
    return {
      values: (0, _utils.normalizeQueryValues)(props.values)
    };
  } else {
    return {
      name: "",
      values: []
    };
  }
}))((_temp = _class = function (_Component) {
  _inherits(_class, _Component);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this._key = (0, _utils.uid)();
    return _this;
  }

  _createClass(_class, [{
    key: "getChildContext",
    value: _getChildContext
  }, {
    key: "componentDidMount",
    value: _componentDidMount
  }, {
    key: "componentDidUpdate",
    value: _componentDidUpdate
  }, {
    key: "componentWillUnmount",
    value: _componentWillUnmount
  }, {
    key: "render",
    value: _render
  }]);

  return _class;
}(_react.Component), _class.displayName = "QueryParam", _class.childContextTypes = {
  "@@query/currentKey": _react2.default.PropTypes.symbol
}, _temp));

exports.default = QueryParam;