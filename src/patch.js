import {isExist} from './util'
import {toHTML} from './toHTML'
import * as patchType from './patchType'

const setProps = (node, props) => {
  Object.keys(props).forEach(prop => {
    const value = props[prop]

    if (isExist(value))
      node.setAttribute(prop, props[prop])
    else
      node.removeAttribute(prop)
  })
}

let walker = 0
export const patch = (node, patches, index = 0) => {
  walker = index
  const currentPatch = patches[walker++]

  if (currentPatch) {
    switch (currentPatch.type) {
      case patchType.TEXT:
        node.nodeValue = currentPatch.content
        break

      case patchType.PROPS:
        setProps(node, currentPatch.props)
        break

      case patchType.REPLACE:
        if (isExist(currentPatch.node)) {
          node.parentNode.replaceChild(toHTML(currentPatch.node), node)
        } else {
          node.parentNode.removeChild(node)
        }
        break

      case patchType.ADD_CHILD:
        node.appendChild(toHTML(currentPatch.node))
        break

      default:
    }
  }

  if (node.childNodes.length === 0) return

  [...node.childNodes].forEach(child =>
    patch(child, patches, walker)
  )
}
