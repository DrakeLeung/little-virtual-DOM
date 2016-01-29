export const VNode = (
  type = '',
  props = {},
  children = []
) => {
  return {
    type,
    props,
    children
  }
}
