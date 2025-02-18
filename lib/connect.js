"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function connect(HOC, dependencies, mergeProps, component) {
  if (mergeProps && !component) {
    component = mergeProps;
    mergeProps = null;
  } else if (!mergeProps && !component) {
    component = dependencies;
    dependencies = {};
    mergeProps = null;
  }

  return HOC(dependencies, mergeProps, component);
}

exports.default = function (HOC) {
  return function (dependencies, mergeProps, component) {
    return connect(HOC, dependencies, mergeProps, component);
  };
};

var decoratorFactory = exports.decoratorFactory = function decoratorFactory(HOC) {
  return function (dependencies) {
    return function (component) {
      return connect(HOC, dependencies)(component);
    };
  };
};
//# sourceMappingURL=connect.js.map