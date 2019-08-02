import React from 'react'
import ModalFactory from './ModalFactory'

const defaultArea = 'stack'

let modalStack = {}

if (typeof window !== 'undefined') {
  if (window.modalStack) {
    modalStack = window.modalStack
  }
}

const PromiseModal = options => (
  <ModalFactory ref={node => { modalStack[options && options.area || defaultArea] = node }} />
)

const createModal = (Component, options) => props => modalStack[options && options.area || defaultArea].create(Component, options)(props)

export default PromiseModal

export { createModal }
