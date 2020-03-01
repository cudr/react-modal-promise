import * as React from 'react'
import hexGen, { Hex } from './hexGen'

export type FactoryOptions = {
  exitTimeout?: number
  enterTimeout?: number
}

export type Component = React.ComponentType<any>

export type FactoryState = {
  instances: {
    [key: string]: {
      Component: Component
      props: FactoryOptions & any
      resolve: any
    } & any
  }
  hashStack: Hex[]
}

class Factory extends React.PureComponent<any, FactoryState> {
  public factoryContainer?: HTMLDivElement | null

  private defaultOptions: FactoryOptions = {
    exitTimeout: 500,
    enterTimeout: 50
  }

  state: FactoryState = {
    instances: {},
    hashStack: []
  }

  componentWillUnmount() {
    this.resolveAll()
  }

  render() {
    return <div ref={this.factoryRef}>{this.getInstances()}</div>
  }

  private factoryRef = (node: HTMLDivElement) => {
    this.factoryContainer = node
  }

  private getInstances = () => {
    const keys = Object.keys(this.state.instances)

    const mapKeys = keys.map(key => {
      const { Component, props, resolve } = this.state.instances[key]

      const isOpen = Boolean(this.state.hashStack.find(h => h === key))

      return (
        <Component
          {...props}
          key={key}
          isOpen={isOpen}
          onResolve={resolve}
          // legacy
          close={resolve}
          open={isOpen}
        />
      )
    })

    return mapKeys
  }

  public create = (Component: Component, options: any = {}) => (
    props = { modalId: hexGen() }
  ) =>
    new Promise(promiseResolve => {
      const hash = props.modalId || hexGen()
      const itemOptions = { ...this.defaultOptions, ...options }

      const resolve = (value: any) => {
        this.remove(hash)
        promiseResolve(value)
      }

      const entity = {
        Component,
        props: { ...itemOptions, ...props },
        resolve,
        ...itemOptions
      }

      const instances = this.props.appendEntities
        ? {
            ...this.state.instances,
            [hash]: entity
          }
        : {
            [hash]: entity,
            ...this.state.instances
          }

      this.setState(
        {
          instances
        },
        () => {
          setTimeout(() => {
            this.setState({ hashStack: [...this.state.hashStack, hash] })
          }, itemOptions.enterTimeout)
        }
      )
    })

  private remove = (hash: Hex): void => {
    const {
      instances: { [hash]: target }
    } = this.state
    const exitTimeout = target && target.exitTimeout
    this.setState(
      {
        hashStack: this.state.hashStack.filter(h => h !== hash)
      },
      () => {
        setTimeout(this.omitState, exitTimeout, hash)
      }
    )
  }

  private omitState = (hash: Hex) => {
    const { [hash]: _, ...instances } = this.state.instances
    this.setState({ instances })
  }

  public resolveAll = () => {
    Object.values(this.state.instances).forEach(instance => instance.resolve())
  }
}

export default Factory
