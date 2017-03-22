"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = liftReducer;

var _reactRouterRedux = require("react-router-redux");

var defaultState = { router: { location: null } };

function _ref() {
  return [];
}

function liftReducer(reducer) {
  var mapLocationToActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _ref;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];

    if (action.type === _reactRouterRedux.LOCATION_CHANGE) {
      var actions = mapLocationToActions(action.payload);
      var nextState = actions.reduce(reducer, state);
      var router = (0, _reactRouterRedux.routerReducer)(state.router, action);
      return _extends({}, nextState, { router: router });
    }
    return reducer(state, action);
  };
}