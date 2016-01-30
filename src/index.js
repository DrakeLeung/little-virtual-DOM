import { VNode } from './VNode'
import { toHTML } from './toHTML'
import { patch } from './patch'
import { diffProps, diff } from './diff'

const VTree0 = VNode('div', {'id': 'container'}, [
  VNode('h1', {style: 'color: blue'}, ['simple virtal dom']),
  VNode('ul', {}, [VNode('li')])
])

const VTree1 = VNode('div', {'id': 'container'}, [
  VNode('h1', {style: 'color: red'}, ['simple virtal dom']),
  VNode('ul', {style: 'background: #ccc'}, [VNode('li'), VNode('li')]),
  VNode('p', {}, ['call me p'])
])

const tree0 = toHTML(VTree0)
document.body.appendChild(tree0)

const treeDiff = diff(VTree0, VTree1)
console.log(treeDiff)
patch(tree0, treeDiff)
