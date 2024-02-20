import {
  type ObjectIteratee,
  camelCase,
  isArray,
  isObject,
  mapKeys,
  mapValues,
  snakeCase,
} from 'lodash'

const deepMapKeys = <T>(obj: T, mapper: ObjectIteratee<T & object>): T => {
  if (isArray(obj)) {
    return obj.map((v) => deepMapKeys(v, mapper)) as T
  } else if (isObject(obj)) {
    return mapValues(mapKeys(obj, mapper), (v) => deepMapKeys(v, mapper as T & object)) as T
  } else {
    return obj
  }
}

export const toWire = <T extends object>(objects: T[]) => {
  return deepMapKeys(objects, (_, key) => camelCase(key))
}

export const toDb = <T extends object>(objects: T[]) => {
  return deepMapKeys(objects, (_, key) => snakeCase(key))
}
