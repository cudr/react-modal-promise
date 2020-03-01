import React from 'react'
import ModalFactory from './Factory'

import { Hex } from './hexGen'

export type Scope = string

type InjectedModalProps<Result> = {
  isOpen?: boolean
  onResolve?: (result: Result) => void
  modalId?: string | Hex

  // legacy
  open?: boolean
  close?: (result: Result) => void
}

export type ModalOptions = {
  scope?: Scope
  exitTimeout?: number
  enterTimeout?: number
}

export type ControllerPropsModel = {
  scope: Scope
  appendEntities?: boolean
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
    scope: defaultScope,
    appendEntities: false
  }

  resolveAll = () => factoryStack[this.props.scope].resolveAll()
  remove = (id: any) => factoryStack[this.props.scope].remove(id)

  render() {
    const { scope = defaultScope, ...rest } = this.props
    return (
      <ModalFactory
        {...rest}
        ref={(node: ModalFactory) => {
          factoryStack[scope] = node
        }}
      />
    )
  }
}

const createModal: CreateModalModel = (Component, options) => props =>
  factoryStack[(options && options.scope) || defaultScope].create(
    Component,
    options
  )(props)

export default PromiseController

export { createModal }
