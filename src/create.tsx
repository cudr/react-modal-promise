import { getContainer } from './utils'
import { CreateInstance } from './types'

/** @deprecated */
export const createModal: CreateInstance = (Component, options) => props =>
  getContainer(options?.scope).create(Component, options, props)

export const create: CreateInstance = (Component, options) => props =>
  getContainer(options?.scope).create(Component, options, props)
