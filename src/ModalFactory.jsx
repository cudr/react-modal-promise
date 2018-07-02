import React, { PureComponent } from 'react'
import randHex from './randHex'

class ModalFactory extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      modals: {},
      hashStack: []
    }
  }

  getModals = () => {
    const keys = Object.keys(this.state.modals)

    const mapKeys = keys.map(key => {
      const { Component, props, resolve } = this.state.modals[key]

      return (
        <Component
          {...props}
          key={key}
          close={resolve}
          open={this.state.hashStack.find(h => h === key)}
        />
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
        }
      }, () => {
        setTimeout(() => {
          this.setState({ hashStack: [ ...this.state.hashStack, hash ] })
        }, 50)
      })
    })
  }

  delete = hash => {
    this.setState({
      hashStack: this.state.hashStack.filter(h => h !== hash)
    }, () => {
      setTimeout(this.omitState, 2000, hash)
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
