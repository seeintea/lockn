import isNull from "lodash/isNull"
import isPlainObject from "lodash/isPlainObject"
import isUndefined from "lodash/isUndefined"

export function removeNullOrUndefined(object: Record<string, unknown>) {
  if (!isPlainObject(object)) return object
  Object.keys(object).forEach((key) => {
    const val = object[key]
    if (isUndefined(val) || isNull(val)) {
      delete object[key]
    }
  })
  return object
}
