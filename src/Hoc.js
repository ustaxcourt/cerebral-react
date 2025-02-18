import React from 'react'
import { View, throwError } from 'cerebral'
import PropTypes from 'prop-types'
import { ControllerContext } from './context'

class BaseComponent extends React.Component {
  constructor(dependencies, mergeProps, props, controller, name) {
    super(props)
    if (!controller) {
      throwError(
        'Can not find controller, did you remember to use the Container component? Read more at: http://cerebraljs.com/docs/api/components.html#react'
      )
    }

    this.onUpdate = this.onUpdate.bind(this)
    this.view = new View({
      dependencies,
      mergeProps,
      props,
      controller,
      displayName: name,
      onUpdate: this.onUpdate,
    })
    this.view.mount()
  }

  /*
    We only allow forced render by change of props passed
    or Container tells it to render
  */
  shouldComponentUpdate(nextProps) {
    return this.view.onPropsUpdate(this.props, nextProps)
  }

  /*
    We have to update any usage of "get" when the component mounts
  */
  componentDidMount() {
    if (this.view.dynamicDependencies.length) {
      this.view.update(this.props)
    }
  }

  /*
    We have to update any usage of "get" when the component updates
  */
  componentDidUpdate() {
    if (this.view.dynamicDependencies.length) {
      this.view.update(this.props)
    }
  }

  /*
    Unregister with existing state dependencies
  */
  componentWillUnmount() {
    this.view.unMount()
  }

  onUpdate(stateChanges, force) {
    this.view.updateFromState(stateChanges, this.props, force)
    this.forceUpdate()
  }
}

export default function HOC(dependencies, mergeProps, Component) {
  class CerebralComponent extends BaseComponent {
    constructor(props, context) {
      super(
        dependencies,
        mergeProps,
        props,
        context,
        Component.displayName || Component.name
      )
    }

    toJSON() {
      return this.view._displayName
    }

    render() {
      return this.view.render(this.props, (props) =>
        React.createElement(Component, props)
      )
    }
  }
  CerebralComponent.displayName = `CerebralWrapping_${Component.displayName ||
    Component.name}`

  CerebralComponent.contextType = ControllerContext

  return CerebralComponent
}