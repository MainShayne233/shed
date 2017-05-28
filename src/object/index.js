/**
 * Returns true if objects are equivalent, false otherwise
 * Equivlanet means that every value at every level is equal in both objects
 * @params {object} object1 - First object
 * @params {object} object2 - Second object
 * @returns {boolean}
 * @example
 * equivalent({hi: {how: 'are you'}}, {hi: {how: 'are you'}})
 * //=> true
 * @example
 * equivalent({hi: {how: 'are you'}}, {hi: {how: 'art thou?'}})
 * //=> false
 */ 
export function equivalent(object1, object2) {
  if (object1 === null) return object2 === null
  const [constructor1, constructor2] = [object1, object2].map(object => object.constructor)
  if (constructor1 !== constructor2) return false
  if (constructor1 === Object || constructor1 === Array) {
    const [keys1, keys2] = [object1, object2].map(Object.keys)
    if (keys1.length !== keys2.length) return false
    for (const key of keys1)
      if (!equivalent(object1[key], object2[key])) return false
    return true
  } else
    return object1 === object2
}

/**
 * Merges two objects into one new object
 * object2 will overwrite matching keys in object1
 * @params {object} object1 - First Object
 * @params {object} object2 - Second Object
 * @returns {object}
 * @example
 * merge({woah: 'we', seeya: 'soon'}, {done: 'merged', seeya: 'later'})
 * //=> {woah: 'we', done: 'merged', seeya: 'later'}
 */
export function merge(object1, object2) {
  let newObject = {}
  for ( const key of Object.keys(object1) ) newObject[key] = object1[key]
  for ( const key of Object.keys(object2) ) newObject[key] = object2[key]
  return newObject
}
