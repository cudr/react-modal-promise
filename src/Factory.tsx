import * as React from 'react'
import hexGen, { Hex } from './hexGen'

export type FactoryOptions = {
  exitTimeout?: number
  enterTimeout?: number
}

export type InstanceId = Hex | string
export type Component = React.ComponentType<any>

export type Resolver = (value?: any) => void

export interface Instance extends FactoryOptions {
  Component: Component
  props: FactoryOptions & any
  resolve: Resolver
}

export interface FactoryProps {
  isAppendIntances?: boolean
  onOpen?: (id?: Hex, instance?: Instance) => void
  onResolve?: (result?: any, id?: InstanceId) => void
  onRemove?: (id?: InstanceId) => void
}

export type FactoryState = {
  instances: {
    [key: string]: Instance
  }
  hashStack: Hex[]
}

class Factory extends React.PureComponent<FactoryProps, FactoryState> {
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
    return <div ref={this.factoryRef}>{this.getInstanceChildren()}</div>
  }

  private factoryRef = (node: HTMLDivElement) => {
    this.factoryContainer = node
  }

  private getInstanceChildren = () => {
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
          // legacy API
          close={resolve}
          open={isOpen}
        />
      )
    })

    return mapKeys
  }

  public create = (Component: Component, options: any = {}) => (props: any) =>
    new Promise(promiseResolve => {
      const hash = (props && props.instanceId) || hexGen()

      const instanceOptions = { ...this.defaultOptions, ...options }

      const { isAppendIntances, onOpen, onResolve } = this.props

      const resolve = (value: any) => {
        this.remove(hash)
        promiseResolve(value)
        onResolve && onResolve(value, hash)
      }

      const instance = {
        Component,
        props: { ...instanceOptions, ...props },
        resolve,
        ...instanceOptions
      }

      const instances = isAppendIntances
        ? {
            ...this.state.instances,
            [hash]: instance
          }
        : {
            [hash]: instance,
            ...this.state.instances
          }

      this.setState(
        {
          instances
        },
        () => {
          setTimeout(() => {
            this.setState({ hashStack: [...this.state.hashStack, hash] })
          }, instanceOptions.enterTimeout)
        }
      )

      onOpen && onOpen(hash, instance)
    })

  private omitState = (hash: InstanceId) => {
    const { [hash]: _, ...instances } = this.state.instances

    this.setState({ instances }, () => {
      const { onRemove } = this.props

      onRemove && onRemove(hash)
    })
  }

  private remove = (hash: InstanceId): void => {
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

  public getInstance = (hash: InstanceId): Instance | undefined =>
    this.state.instances[hash]

  public resolve = (hash: InstanceId, value: any) => {
    const instance = this.state.instances[hash]

    if (instance) return instance.resolve(value)
  }

  public resolveAll = () => {
    Object.values(this.state.instances).forEach(instance => instance.resolve())
  }
}

export default Factory
