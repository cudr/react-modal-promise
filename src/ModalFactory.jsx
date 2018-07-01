import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import randHex from './randHex'

const PortalWrapper = ({ children, container }) => createPortal(children, container)

class ModalFactory extends PureComponent {

  static props = {
    killTimeout: 1000
  }

  constructor(props) {
    super(props)

    this.state = {
      modals: {},
      hashStask: []
    }
  }

  getModals = () => {
    const keys = Object.keys(this.state.modals)

    const mapKeys = keys.map(key => {
      const { Component, props, resolve } = this.state.modals[key]

      return (
        <PortalWrapper key={key} container={this.modalContainer}>
          <Component
            {...props}
            close={resolve}
            open={this.state.hashStask.find(h => h === key)}
          />
        </PortalWrapper>
      )
    })

    return mapKeys
  }

  create = Component => {
    return props => new Promise(promiseResolve => {
      const hash = randHex()

      const resolve = value => {
        this.delete(hash)
        promiseResolve(value)
      }

      this.setState({
        modals: {
          [hash]: {
            Component,
            props,
            resolve
          },
          ...this.state.modals
        },
        hashStask: [ ...this.state.hashStask, hash ]
      })
    })
  }

  delete = hash => {
    this.setState({
      hashStask: this.state.hashStask.filter(h => h !== hash)
    }, () => {
      setTimeout(this.omitState, this.props.killTimeout, hash)
    })
  }

  omitState = hash => {
    const { [hash]:_ , ...modals } = this.state.modals
    this.setState({ modals })
  }

  render() {
    return (
      <div ref={node => { this.modalContainer = node }}>
        {this.getModals()}
      </div>
    )
  }
}

export default ModalFactory
