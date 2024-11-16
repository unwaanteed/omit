import { isArray, falsely, isObject, isString, isFunction } from "@unwanted/common";

export const omit = (obj?: any, options?: any) => {
  if (!isObject(obj)) {
    return {};
  }

  let isShouldOmit;
  if (isFunction(options)) {
    isShouldOmit = options;
  } else if (isArray(options)) {
    isShouldOmit = (name: string) => options.includes(name);
  } else if (isString(options)) {
    isShouldOmit = (val: string) => val === options;
  } else if (options === true) {
    return {};
  } else if (!options) {
    isShouldOmit = falsely;
  } else {
    throw new Error("Invalid options type");
  }

  const list = Object.keys(obj);

  const result = {};

  for (let i = 0; i < list.length; i += 1) {
    const key = list[i];
    const val = obj[key!];

    if (!isShouldOmit(key, val, obj)) {
      const descr = Object.getOwnPropertyDescriptor(obj, key!);
      if (descr !== undefined) {
        Object.defineProperty(result, key!, descr);
      }
    }
  }
  return result;
};
