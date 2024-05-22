export function commonElts(arr1: Array<any>, arr2: Array<any>): Array<any> {
  return arr1.filter((elt) => arr2.includes(elt));
}
