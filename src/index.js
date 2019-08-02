import React from 'react'
import ModalFactory from './ModalFactory'

const defaultArea = 'stack'

const modal = {}

const PromiseModal = ({ area = defaultArea }) => (
  <ModalFactory ref={node => { modal[area] = node }} />
)

const createModal = (Component, { area = defaultArea, ...options}) => props => modal[area].create(Component, options)(props)

export default PromiseModal

export { createModal }
