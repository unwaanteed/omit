import { isArray, falsely, isObject, isString, isFunction } from "@unwanted/common";

export const omit = (obj?: any, props?: any) => {
  if (!isObject(obj)) {
    return {};
  }

  let isShouldOmit;
  if (isFunction(props)) {
    isShouldOmit = props;
  } else if (isArray(props)) {
    isShouldOmit = (name: string) => props.includes(name);
  } else if (isString(props)) {
    isShouldOmit = (val: string) => val === props;
  } else if (props === true) {
    return {};
  } else if (!props) {
    isShouldOmit = falsely;
  } else {
    throw new Error("Unsupported type of 'props'");
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
