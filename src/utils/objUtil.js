/**
 * @description 判断两个对象是否相等
 * @param {Object} a 需要比较的其中一个对象
 * @param {Object} b 需要比较的另一个对象
 * @returns {boolean} 相等返回true，否则返回false
 */
export function isObjectValueEqual(a, b) {
  var aProps = Object.keys(a);
  var bProps = Object.keys(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName] && propName !== '__ob__') {
      // value为数组且长度为0
      if (Array.isArray(a[propName]) && Array.isArray(b[propName]) && !a[propName].length && !b[propName].length) {
        return true;
      }
      return false;
    }
  }
  return true;
}