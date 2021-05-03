import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Container, { create, InstanceProps } from '../'
import { ContainerRef } from '../types'

interface Props extends InstanceProps<string> {
  value?: string
  error?: string
}

const Modal: React.FC<Props> = ({
  value,
  error,
  isOpen,
  onResolve,
  onReject,
}) => {
  if (!isOpen) return null

  return (
    <div id="test">
      Test Modal
      <button id="resolve" onClick={() => onResolve(value)}>
        submit
      </button>
      <button id="reject" onClick={() => onReject(error)}>
        dismiss
      </button>
    </div>
  )
}

const sleep = (time: number = 100) => new Promise(res => setTimeout(res, time))

const update = async (el: any, callback?: () => void) => {
  await act(async () => {
    await new Promise(r => setTimeout(r, 0))
    await callback?.()
    el.update()
  })
}

describe('simple render suite', () => {
  const container = mount(<Container />)

  const testModal = create(Modal, { enterTimeout: 10, exitTimeout: 10 })

  it('return correct value', async () => {
    let modal

    await update(container, () => {
      modal = testModal({ value: 'foo' })
    })

    expect(modal).resolves.toBe('foo')
  })

  it('mount first', async () => {
    await update(container, () => sleep(10))

    expect(container.find('#test').length).toBe(1)
  })

  it('pass correct props to component', async () => {
    expect(container.find(Modal).props().value).toBe('foo')
    expect(container.find(Modal).props().enterTimeout).toBe(10)
  })

  it('mount second', async () => {
    let modal

    await update(container, () => {
      modal = testModal({ value: 'bar' })
    })

    expect(modal).resolves.toBe('bar')

    await update(container, () => sleep(10))

    expect(container.find('#test').length).toBe(2)
  })

  it('unmount first', async () => {
    container.find(Modal).at(1).find('#resolve').simulate('click')

    expect(container.find('#test').length).toBe(1)
  })

  it('unmount second', async () => {
    container.find(Modal).find('#resolve').simulate('click')

    expect(container.find('#test').length).toBe(0)
  })
})

describe('scope render suite', () => {
  const scopeContainer = mount(<Container scope="my_scope" />)

  const scopeModal = create(Modal, {
    scope: 'my_scope',
    enterTimeout: 10,
    exitTimeout: 10,
  })

  it('render in scope', async () => {
    await update(scopeContainer, () => {
      scopeModal({ value: 'modal_one_value' })

      return sleep(10)
    })

    expect(scopeContainer.find('#test').length).toBe(1)
  })
})

describe('reference suite', () => {
  const containerRef = React.createRef<ContainerRef>() as {
    current: ContainerRef
  }
  const container = mount(<Container scope="reference" ref={containerRef} />)

  const referenceModal = create(Modal, {
    scope: 'reference',
    enterTimeout: 10,
    exitTimeout: 10,
  })

  it('resolve instance', async () => {
    let modal1, modal2

    await update(container, () => {
      modal1 = referenceModal({ instanceId: 'one', value: 'foo' })
      modal2 = referenceModal({ instanceId: 'two' })

      return sleep(10)
    })

    expect(modal1).resolves.toBe('foo')
    expect(modal2).resolves.toBe(undefined)

    await update(container, () => {
      containerRef.current.resolve('one', 'foo')
    })

    expect(container.find('#test').length).toBe(1)

    await update(container, () => {
      containerRef.current.resolve('two')
    })

    expect(container.find('#test').length).toBe(0)
  })

  it('reject instance', async () => {
    let modal1, modal2

    await update(container, () => {
      modal1 = referenceModal({ instanceId: 'one' })
      modal2 = referenceModal({ instanceId: 'two', error: 'bar' })

      return sleep(10)
    })

    expect(modal1).rejects.toBe('foo')
    expect(modal2).rejects.toBe('bar')

    expect(container.find('#test').length).toBe(2)

    await update(container, () => {
      containerRef.current.reject('one', 'foo')
    })

    expect(container.find('#test').length).toBe(1)

    container.find(Modal).find('#reject').simulate('click')

    expect(container.find('#test').length).toBe(0)
  })

  it('resolve all instances', async () => {
    let modal1, modal2

    await update(container, () => {
      modal1 = referenceModal()
      modal2 = referenceModal()

      return sleep(10)
    })

    expect(modal1).resolves.toBe('foo')
    expect(modal2).resolves.toBe('foo')

    expect(container.find('#test').length).toBe(2)

    await update(container, () => {
      containerRef.current.resolveAll('foo')
    })

    expect(container.find('#test').length).toBe(0)
  })

  it('reject all instances', async () => {
    let modal1, modal2

    await update(container, () => {
      modal1 = referenceModal()
      modal2 = referenceModal()

      return sleep(10)
    })

    expect(modal1).rejects.toBe('bar')
    expect(modal2).rejects.toBe('bar')

    expect(container.find('#test').length).toBe(2)

    await update(container, () => {
      containerRef.current.rejectAll('bar')
    })

    expect(container.find('#test').length).toBe(0)
  })
})
