import { Hex } from './utils'

export type Scope = string

export interface ScopeModel {
  [key: string]: ContainerRef
}

export type InstanceId = Hex | string

export type Resolver = <T>(id: InstanceId, value?: T) => T | void
export type Rejector = <T>(id: InstanceId, reason?: T) => T | void

export type InstanceComponent<T> = React.ComponentType<T>
export interface InstanceOptions {
  scope?: Scope
  instanceId?: InstanceId
  enterTimeout?: number
  exitTimeout?: number
}

export interface InstanceProps<Result> extends InstanceOptions {
  isOpen: boolean
  instanceId: Hex
  onReject: (reason?: Result) => void
  onResolve: (result?: Result) => void

  /** @deprecated **/
  open: boolean
  /** @deprecated **/
  close: (result: Result) => void
}

export interface Instance extends InstanceOptions {
  Component: InstanceComponent<any>
  props: InstanceOptions
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}
export interface ContainerProps extends InstanceOptions {
  isAppendIntances?: boolean
  onOpen?: (id?: InstanceId, instance?: Instance) => void
  onResolve?: Resolver
  onReject?: Rejector
  onRemove?: (id?: InstanceId) => void
}

export interface ContainerRef {
  create: InstanceCreator
  resolve: Resolver
  resolveAll: <T>(value?: T) => void
  reject: Rejector
  rejectAll: <T>(reason?: T) => void
  getInstance: (id: InstanceId) => Instance | null
  hasInstance: (id: InstanceId) => boolean
}
export interface CreateInstance {
  <T extends InstanceProps<Result>, Result = any>(
    Component: InstanceComponent<T>,
    options?: InstanceOptions
  ): (
    props?: Omit<T, keyof InstanceProps<Result>> &
      Partial<InstanceProps<Result>>
  ) => Promise<Result>
}

export type InstanceCreator = <T, Result>(
  Component: InstanceComponent<T>,
  options?: InstanceOptions,
  props?: Omit<T, keyof InstanceProps<Result>> & Partial<InstanceProps<Result>>
) => Promise<Result>
