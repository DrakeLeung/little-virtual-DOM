import {isString, isExist, isEmptyObject} from './util'
import * as patchType from './patchType'

export const getDiffProps = (oldProps, newProps) => {
  if (!isExist(oldProps) || !isExist(newProps)) return

  if (isEmptyObject(oldProps)) {
    return Object.keys(newProps).reduce((prev, prop) => {
      prev[prop] = newProps[prop]
      return prev
    }, {})
  }

  // find removed props & different props
  return Object.keys(oldProps).reduce((prev, prop, index, arr) => {
    let oldValue = oldProps[prop]
    let newValue = newProps[prop]

    // different props & modified props
    if (newValue !== oldValue) {
      prev[prop] = newValue
    }
    delete newProps[prop] // for not iterate the whole newProps

    // new prop
    if (index === arr.length - 1) {
      Object.keys(newProps).forEach(prop => {
        prev[prop] = newProps[prop]
      })
    }

    return prev
  }, {})
}

// represent cucrrent node index
let walker = 0

export const getDiffChildren = (
  oldChildren = [],
  newChildren = [],
  index
) => {
  walker = index

  const oldChildrenPatches = oldChildren.reduce((prev, oldChild, i) => {
    return Object.assign(
      prev,
      diff(oldChild, newChildren[i], ++walker)
    )
  }, {})

  // const newChildrenPatches = {}
  const newChildrenPatches =
    newChildren.slice(oldChildren.length).reduce((prev, newChild) => {
      return Object.assign(
        prev,
        diff(null, newChild, index)
      )
    }, oldChildrenPatches)

  return Object.assign(oldChildrenPatches, newChildrenPatches)
}

export const diff = (oldTree, newTree, index = 0) => {
  let patches = {}

  if (!isExist(oldTree) && !isExist(newTree)) return

  if (isString(oldTree) && isString(newTree)) {
    if (oldTree !== newTree) {
      patches[index] = {
        type: patchType.TEXT,
        content: newTree
      }

      return patches
    }
  } else if ((oldTree && newTree) && (oldTree.type === newTree.type)) {
    // diff props
    const diffProps = getDiffProps(oldTree.props, newTree.props)

    if (!isEmptyObject(diffProps)) {
      patches[index] = {
        type: patchType.PROPS,
        props: diffProps
      }
    }

  // replace node
  } else if (isExist(oldTree)) {
    patches[index] = {
      type: patchType.REPLACE,
      node: newTree
    }

    // becuz we do the replace child operation
    // so we dont get diff children
    walker += oldTree.children.length
    return patches

  // add child
  } else {
    patches[index] = {
      type: patchType.ADD_CHILD,
      node: newTree
    }

    return patches
  }

  return Object.assign(
    patches,
    getDiffChildren(oldTree.children, newTree.children, index)
  )
}
