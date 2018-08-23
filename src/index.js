import React from 'react'
import ModalFactory from './ModalFactory'

const modal = {}

const PromiseModal = () => (
  <ModalFactory ref={node => { modal.stack = node }} />
)

const createModal = (Component, options) => props => modal.stack.create(Component, options)(props)

export default PromiseModal

export { createModal }
