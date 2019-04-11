import React, { PureComponent } from 'react'
import randHex from './randHex'

class ModalFactory extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      modals: {},
      hashStack: []
    }
    this.defaultOptions = {
      exitTimeout: 500,
      enterTimeout: 50
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
          open={Boolean(this.state.hashStack.find(h => h === key))}
        />
      )
    })

    return mapKeys
  }

  create = (Component, options={}) => {
    return props => new Promise(promiseResolve => {
      const hash = randHex()
      const resultOptions = { ...this.defaultOptions, ...options }
      const resolve = value => {
        this.delete(hash)
        promiseResolve(value)
      }

      this.setState({
        modals: {
          [hash]: {
            Component,
            props,
            resolve,
            ...resultOptions
          },
          ...this.state.modals
        }
      }, () => {
        setTimeout(() => {
          this.setState({ hashStack: [ ...this.state.hashStack, hash ] })
        }, resultOptions.enterTimeout)
      })
    })
  }

  delete = hash => {
    const { modals: { hash: target } } = this.state
    const exitTimeout = target && target.exitTimeout
    this.setState({
      hashStack: this.state.hashStack.filter(h => h !== hash)
    }, () => {
      setTimeout(this.omitState, exitTimeout, hash)
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
