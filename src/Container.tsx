import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

import {
  hexGen,
  Hex,
  registerContainer,
  unregisterContainer,
  DEFAULT_SCOPE,
} from './utils'

import {
  ContainerRef,
  ContainerProps,
  Instance,
  InstanceId,
  InstanceCreator,
  InstanceOptions,
} from './types'

const InstanceContainer: React.ForwardRefRenderFunction<
  ContainerRef,
  ContainerProps
> = (props, ref) => {
  const {
    scope = DEFAULT_SCOPE,
    enterTimeout,
    exitTimeout,
    isAppendIntances,
    onOpen,
    onRemove,
    onResolve,
    onReject,
  } = props || {}

  const [instances, setInstances] = useState<{ [key: string]: Instance }>({})
  const [hashStack, setHashStack] = useState<Hex[]>([])

  const resolve = useCallback(
    (hash: InstanceId, v) => instances?.[hash]?.resolve(v),
    [instances]
  )
  const resolveAll = useCallback(
    v => Object.values(instances).forEach(i => i.resolve(v)),
    [instances]
  )

  const reject = useCallback(
    (hash: InstanceId, r) => instances?.[hash]?.reject(r),
    [instances]
  )
  const rejectAll = useCallback(
    r => Object.values(instances).forEach(i => i.reject(r)),
    [instances]
  )
  const hasInstance = useCallback((hash: InstanceId) => !!instances?.[hash], [
    instances,
  ])
  const getInstance = useCallback((hash: InstanceId) => instances?.[hash], [
    instances,
  ])

  const remove = useCallback(
    (hash: InstanceId, options: InstanceOptions): void => {
      setHashStack(stack => stack.filter(s => s !== hash))

      setTimeout(() => {
        setInstances(instances => {
          const { [hash]: _, ...omitHash } = instances

          return omitHash
        })
        onRemove?.(hash)
      }, options?.exitTimeout)
    },
    [onRemove]
  )

  const create: InstanceCreator = useCallback(
    (Component, options = {}, props) =>
      new Promise((res, rej) => {
        const hash = props?.instanceId || hexGen()

        const instanceOptions = {
          enterTimeout,
          exitTimeout,
          instanceId: hash,
          ...options,
        }

        const instance: Instance = {
          Component,
          props: { ...instanceOptions, ...props },
          resolve: v => {
            remove(hash, instanceOptions)
            res(v)
            onResolve?.(v, hash)
          },
          reject: r => {
            remove(hash, instanceOptions)
            rej(r)
            onReject?.(r, hash)
          },
          ...instanceOptions,
        }

        setInstances(instances =>
          isAppendIntances
            ? {
                ...instances,
                [hash]: instance,
              }
            : {
                [hash]: instance,
                ...instances,
              }
        )

        setTimeout(
          () => setHashStack(stack => [...stack, hash]),
          instanceOptions.enterTimeout
        )

        onOpen?.(hash, instance)
      }),
    [enterTimeout, exitTimeout, onOpen, onResolve, onReject, isAppendIntances]
  )

  useImperativeHandle(ref, () => ({
    create,
    resolve,
    reject,
    resolveAll,
    rejectAll,
    hasInstance,
    getInstance,
  }))

  useEffect(() => {
    registerContainer(scope, {
      create,
      resolve,
      reject,
      resolveAll,
      rejectAll,
      hasInstance,
      getInstance,
    })

    return () => unregisterContainer(scope)
  }, [scope])

  const mapKeys = useMemo(() => {
    const keys = Object.keys(instances)

    return keys.map(key => {
      const { Component, props, resolve, reject } = instances[key]

      const isOpen = !!hashStack.find(h => h === key)

      return (
        <Component
          {...props}
          key={key}
          isOpen={isOpen}
          onReject={reject}
          onResolve={resolve}
          /** @deprecated **/
          close={resolve}
          /** @deprecated **/
          open={isOpen}
        />
      )
    })
  }, [instances, hashStack])

  return <>{mapKeys}</>
}

export const Container = forwardRef(InstanceContainer)

Container.defaultProps = {
  exitTimeout: 500,
  enterTimeout: 50,
}
