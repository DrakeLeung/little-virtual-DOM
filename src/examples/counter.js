//
// EXAMPLE ARE FROM:
// https://github.com/livoras/simple-virtual-dom/blob/master/example%2Fincreasing-items.html
//

import {VNode} from '../VNode'
import {toHTML} from '../toHTML'
import {patch} from '../patch'
import {diff} from '../diff'

export const counter = () => {
  var count = 0
  function renderTree () {
    count++
    var items = []
    var color = (count % 2 === 0) ? 'blue' : 'red'

    for (var i = 0; i < count; i++) {
      items.push(VNode('li', {}, ['Item #' + i]))
    }
    return VNode('div', {'id': 'container'}, [
      VNode('h1', {style: 'color: ' + color}, ['simple virtal dom']),
      VNode('p', {}, ['the count is :' + count]),
      VNode('ul', {}, items)
    ])
  }
  var tree = renderTree()
  var root = toHTML(tree)
  document.body.appendChild(root)

  setInterval(function () {
    var newTree = renderTree()
    var patches = diff(tree, newTree)
    console.log(patches)
    patch(root, patches)
    tree = newTree
  }, 1000)
}
