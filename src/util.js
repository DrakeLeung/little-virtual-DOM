export const isString = value =>
  typeof value === 'string'

export const isExist = value =>
  value !== null && value !== undefined

export const isEmptyObject = object =>
  Object.keys(object).length === 0
