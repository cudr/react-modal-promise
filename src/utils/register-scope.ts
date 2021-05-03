import { Scope, ScopeModel, ContainerRef } from '../types'

export const DEFAULT_SCOPE = 'stack'
export const SCOPE_KEY = 'factoryStack'
declare global {
  interface Window {
    [SCOPE_KEY]: ScopeModel
  }
}

let scopeStorage: ScopeModel = {}

if (typeof window !== 'undefined') {
  if (!window[SCOPE_KEY]) {
    window[SCOPE_KEY] = {}
  }

  scopeStorage = window[SCOPE_KEY]
}

export const registerContainer = (scope: Scope, ref: ContainerRef) => {
  scopeStorage[scope] = ref

  return ref
}

export const unregisterContainer = (scope: Scope) => {
  delete scopeStorage[scope]
}

export const getContainer = (scope?: Scope) =>
  scopeStorage[scope || DEFAULT_SCOPE]
