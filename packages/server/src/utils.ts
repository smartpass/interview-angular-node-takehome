import { camelCase, mapKeys, snakeCase } from "lodash"

export const toWire = <T extends object>(objects: T[]) => {
  return objects.map((obj) => mapKeys(obj, (_, key) => camelCase(key)))
}

export const toDb = <T extends object>(objects: T[]) => {
  return objects.map((obj) => mapKeys(obj, (_, key) => snakeCase(key)))
}

