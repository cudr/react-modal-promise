import React from 'react'
import ModalFactory from './ModalFactory'

const modal = {}

const PromiseModal = () => (
  <ModalFactory ref={node => { modal.stack = node }} />
)

const createModal = Component => props => modal.stack.create(Component)(props)

export default PromiseModal

export { createModal }
