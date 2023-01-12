/**
 * Create an object composed of the omit object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const omit = (object, keys) => {
    object = Object.keys(object).filter(key =>
        keys.indexOf(key) < 0).reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {}
        );
    return object;
};

module.exports = omit;
