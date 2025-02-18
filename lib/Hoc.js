'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = HOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cerebral = require('cerebral');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _context = require('./context');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseComponent = function (_React$Component) {
  _inherits(BaseComponent, _React$Component);

  function BaseComponent(dependencies, mergeProps, props, controller, name) {
    _classCallCheck(this, BaseComponent);

    var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this, props));

    if (!controller) {
      (0, _cerebral.throwError)('Can not find controller, did you remember to use the Container component? Read more at: http://cerebraljs.com/docs/api/components.html#react');
    }

    _this.onUpdate = _this.onUpdate.bind(_this);
    _this.view = new _cerebral.View({
      dependencies: dependencies,
      mergeProps: mergeProps,
      props: props,
      controller: controller,
      displayName: name,
      onUpdate: _this.onUpdate
    });
    _this.view.mount();
    return _this;
  }

  /*
    We only allow forced render by change of props passed
    or Container tells it to render
  */


  _createClass(BaseComponent, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.view.onPropsUpdate(this.props, nextProps);
    }

    /*
      We have to update any usage of "get" when the component mounts
    */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.view.dynamicDependencies.length) {
        this.view.update(this.props);
      }
    }

    /*
      We have to update any usage of "get" when the component updates
    */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.view.dynamicDependencies.length) {
        this.view.update(this.props);
      }
    }

    /*
      Unregister with existing state dependencies
    */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.view.unMount();
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(stateChanges, force) {
      this.view.updateFromState(stateChanges, this.props, force);
      this.forceUpdate();
    }
  }]);

  return BaseComponent;
}(_react2.default.Component);

function HOC(dependencies, mergeProps, Component) {
  var CerebralComponent = function (_BaseComponent) {
    _inherits(CerebralComponent, _BaseComponent);

    function CerebralComponent(props, context) {
      _classCallCheck(this, CerebralComponent);

      return _possibleConstructorReturn(this, (CerebralComponent.__proto__ || Object.getPrototypeOf(CerebralComponent)).call(this, dependencies, mergeProps, props, context, Component.displayName || Component.name));
    }

    _createClass(CerebralComponent, [{
      key: 'toJSON',
      value: function toJSON() {
        return this.view._displayName;
      }
    }, {
      key: 'render',
      value: function render() {
        return this.view.render(this.props, function (props) {
          return _react2.default.createElement(Component, props);
        });
      }
    }]);

    return CerebralComponent;
  }(BaseComponent);

  CerebralComponent.displayName = 'CerebralWrapping_' + (Component.displayName || Component.name);

  CerebralComponent.contextType = _context.ControllerContext;

  return CerebralComponent;
}
//# sourceMappingURL=Hoc.js.map