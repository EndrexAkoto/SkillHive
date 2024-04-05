"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _enviroment = _interopRequireDefault(require("./enviroment.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var configureEnvironment = function configureEnvironment() {
  _dotenv["default"].config({
    path: (0, _enviroment["default"])()
  });

  return process.env;
};

var _default = configureEnvironment;
exports["default"] = _default;