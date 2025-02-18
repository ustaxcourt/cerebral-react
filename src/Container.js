import React from 'react'
import PropTypes from 'prop-types'
import { throwError } from 'cerebral'
import { DEPRECATE } from 'cerebral/internal'
import { ControllerContext } from './context'

class Container extends React.Component {
  render() {
    const { app, controller } = this.props

    if (controller) {
      DEPRECATE(
        'Container',
        'please change from "controller" to "app" property'
      )
    }

    if (!app && !controller) {
      throwError('You are not passing a Cerebral app to Container')
    }

    return <ControllerContext.Provider value={app || controller}>{this.props.children}</ControllerContext.Provider>
  }
}

Container.propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

export default Container