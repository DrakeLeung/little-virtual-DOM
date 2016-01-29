import {isString, isExist, isEmptyObject} from './util'
import * as patchType from './patchType'

export const getDiffProps = (oldProps, newProps) => {
  if (!isExist(oldProps) || !isExist(newProps)) return

  // find removed props & different props
  return Object.keys(oldProps).reduce((prev, prop, index, arr) => {
    let oldValue = oldProps[prop]
    let newValue = newProps[prop]

    // different props & modified props
    if (newValue !== oldValue) {
      prev[prop] = newValue
    }
    delete newProps[prop]

    // new prop
    if (index === arr.length - 1) {
      Object.keys(newProps).forEach(prop => {
        prev[prop] = newProps[prop]
      })
    }

    return prev
  }, {})
}

export const getDiffChildren = (oldChildren, newChildren, index) => {
  const oldChildrenPatches = oldChildren.reduce((prev, oldChild, i) => {
    return Object.assign(
      prev,
      diff(oldChild, newChildren[i], index)
    )
  }, {})

  return oldChildrenPatches
}

export const diff = (oldTree, newTree, index = 0) => {
  let patch = {}
  let currentPatch = {}

  // if both of them are text vnode
  if (isString(oldTree) && isString(oldTree)) {
    if (oldTree !== newTree) {
      currentPatch = Object.assign(currentPatch, {
        type: patchType.TEXT,
        content: newTree
      })
    }
  } else if (oldTree.type === newTree.type) {
    // diff props
    const diffProps = getDiffProps(oldTree.props, newTree.props)

    if (!isEmptyObject(diffProps)) {
      currentPatch = Object.assign(currentPatch, {
        type: patchType.PROPS,
        props: diffProps
      })
    }
  } else {
    currentPatch = Object.assign(currentPatch, {
      type: patchType.REPLACE,
      node: newTree
    })
  }

  !isEmptyObject(currentPatch) && (patch[index] = currentPatch)

  if (isString(oldTree)) return patch

  return Object.assign(
    patch,
    getDiffChildren(oldTree.children, newTree.children, ++index)
  )
}
