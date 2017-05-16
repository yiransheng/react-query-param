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

var _reactRouter = require("react-router");

var _reactRouterRedux = require("react-router-redux");

var _queryString = require("query-string");

var _UrlQuery = require("../UrlQuery");

var _UrlQuery2 = _interopRequireDefault(_UrlQuery);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleChange = (0, _utils.memoize)(function (store) {
  return function (query) {
    var state = store.getState();
    if (!state || !state.router || !state.router.location) {
      return;
    }
    var location = state.router.location;
    var search = "?" + (0, _queryString.stringify)(query);
    if (search !== location.search) {
      store.dispatch((0, _reactRouterRedux.replace)(_extends({}, location, { search: search })));
    }
  };
});

function _render() {
  var store = this.context.store;

  return _react2.default.createElement(
    _UrlQuery2.default,
    { onChange: handleChange(store) },
    this.props.children
  );
}

var ConnectedUrlQuery = function (_Component) {
  _inherits(ConnectedUrlQuery, _Component);

  function ConnectedUrlQuery() {
    _classCallCheck(this, ConnectedUrlQuery);

    return _possibleConstructorReturn(this, (ConnectedUrlQuery.__proto__ || Object.getPrototypeOf(ConnectedUrlQuery)).apply(this, arguments));
  }

  _createClass(ConnectedUrlQuery, [{
    key: "render",
    value: _render
  }]);

  return ConnectedUrlQuery;
}(_react.Component);

ConnectedUrlQuery.contextTypes = {
  store: _propTypes2.default.object
};
exports.default = ConnectedUrlQuery;