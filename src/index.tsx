import React from 'react'
import ModalFactory, { FactoryProps, InstanceId } from './Factory'

import hexGen from './hexGen'

export type Scope = string

type InjectedModalProps<Result> = {
  isOpen?: boolean
  onResolve?: (result: Result) => void
  instanceId?: InstanceId

  // legacy
  open?: boolean
  close?: (result: Result) => void
}

export type ModalOptions = {
  scope?: Scope
  exitTimeout?: number
  enterTimeout?: number
}

export interface ControllerPropsModel extends FactoryProps {
  scope?: Scope
}

export interface CreateModalModel {
  <T extends InjectedModalProps<Result>, Result = any>(
    Component: React.ComponentType<T>,
    options?: ModalOptions
  ): (
    props?: Omit<T, 'isOpen' | 'onResolve' | 'open' | 'close'>
  ) => Promise<Result>
}

interface FactoryStackModel {
  [key: string]: any
}

declare global {
  interface Window {
    factoryStack: FactoryStackModel
  }
}

const defaultScope: Scope = 'stack'

let factoryStack: FactoryStackModel = {}

if (typeof window !== 'undefined') {
  if (!window.factoryStack) {
    window.factoryStack = {}
  }

  factoryStack = window.factoryStack
}

class PromiseController extends React.Component<ControllerPropsModel> {
  static defaultProps = {
    scope: defaultScope
  }

  factoryRef!: ModalFactory

  public getInstance = (id: InstanceId) => this.factoryRef.getInstance(id)
  public hasInstance = (id: InstanceId): boolean =>
    Boolean(this.getInstance(id))

  public resolveAll = () => this.factoryRef.resolveAll()
  public resolve = (id: InstanceId, val: any) =>
    this.factoryRef.resolve(id, val)

  render() {
    const { scope, ...rest } = this.props
    return <ModalFactory {...rest} ref={this.registerRef} />
  }

  registerRef = (node: ModalFactory) => {
    const { scope = defaultScope } = this.props

    if (node) {
      factoryStack[scope] = node
      this.factoryRef = node
    }
  }
}

const createModal: CreateModalModel = (Component, options) => props =>
  factoryStack[(options && options.scope) || defaultScope].create(
    Component,
    options
  )(props)

export default PromiseController

export { createModal, hexGen }
