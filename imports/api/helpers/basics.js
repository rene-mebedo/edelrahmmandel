/**
 * Tests if given Value is an Object or not
 * 
 * @param {Any} val Value to test
 * @returns {Boolean} True if given Value is an Object otherwise false
 */
export const isObject = val => {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}