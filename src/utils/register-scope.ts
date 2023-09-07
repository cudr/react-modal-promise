import { Scope, ScopeModel, ContainerRef } from '../types'

export const DEFAULT_SCOPE = 'stack'
export const SCOPE_KEY = 'factoryStack'
declare global {
  interface Window {
    [SCOPE_KEY]: ScopeModel
  }
}

if (typeof window !== 'undefined') {
  if (!window[SCOPE_KEY]) {
    window[SCOPE_KEY] = {}
  }
}

export const registerContainer = (scope: Scope, ref: ContainerRef) => {
  if (window[SCOPE_KEY][scope]) {
    console.warn('Duplicated scope detected, scope: ' + scope + ' has already been registered, multiple instance of ModalContainer may cause unpredictable behaviors!')
  }
  window[SCOPE_KEY][scope] = ref

  return ref
}

export const unregisterContainer = (scope: Scope) => {
  delete window[SCOPE_KEY][scope]
}

export const getContainer = (scope?: Scope) =>
  window[SCOPE_KEY][scope || DEFAULT_SCOPE]
