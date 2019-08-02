import React from 'react'
import ModalFactory from './ModalFactory'

const defaultArea = 'stack'

const modal = {}

const PromiseModal = options => (
  <ModalFactory ref={node => { modal[options && options.area || defaultArea] = node }} />
)

const createModal = (Component, options) => props => modal[options && options.area || defaultArea].create(Component, options)(props)

export default PromiseModal

export { createModal }
