const createNode = ({
  type,
  props,
  children
}) => {
  // check children if empty
  if (children === (null || undefined)) return

  const node = document.createElement(type)

  // set props
  Object.keys(props).forEach(prop => {
    node.setAttribute(prop, props[prop])
  })

  // set children
  children.forEach(VChild => {
    let childNode

    if (typeof VChild === 'string') {
      childNode = document.createTextNode(VChild)
    } else {
      childNode = createNode(VChild)
    }

    node.appendChild(childNode)
  })

  return node
}

const toHTML = (
  VNode,
  container = document.body
) => {
  if (VNode == null) return

  const node = createNode(VNode)
  // container.appendChild(node)

  return node
}

export { toHTML }
