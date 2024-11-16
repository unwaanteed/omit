import { isFunction } from "@unwanted/common";

import { omit } from "../src";

describe("omit", () => {
  it("should omit a key from the object", () => {
    expect(omit({ a: "a", b: "b", c: "c" }, "a")).toEqual({ b: "b", c: "c" });
    expect(omit({ aaa: "a", bbb: "b", ccc: "c" }, "aaa")).toEqual({
      bbb: "b",
      ccc: "c",
    });
  });

  it("should omit an array of keys from the object", () => {
    expect(omit({ a: "a", b: "b", c: "c" }, ["a", "c"])).toEqual({ b: "b" });
  });

  it("should return the object if no keys are given", () => {
    expect(omit({ a: "a", b: "b", c: "c" })).toEqual({
      a: "a",
      b: "b",
      c: "c",
    });
  });

  it("should return a new object when no keys are given", () => {
    const obj = { a: "a", b: "b", c: "c" };
    expect(omit(obj) !== obj).toBeTruthy();
  });

  it("should omit using a filter function", () => {
    const foo = omit({ a: "a", b: "b", c: "c" }, (key: string) => key === "a");
    const bar = omit({ a: "a", b: "b", c() {} }, (key: any, val: any) => isFunction(val));
    expect(bar).toEqual({ a: "a", b: "b" });
    expect(foo).toEqual({ b: "b", c: "c" });
  });

  it("should return an empty object if the first arg is not an object", () => {
    expect(omit(null, { a: "a", b: "b", c: "c" })).toEqual({});
  });

  it("should return an empty object if no object is specified", () => {
    expect(omit()).toEqual({});
  });

  it("should omit all items", () => {
    expect(
      omit(
        {
          __dirname: false,
          __filename: false,
          Buffer: false,
          clearImmediate: false,
          clearInterval: false,
          clearTimeout: false,
          console: false,
          exports: true,
          global: false,
          Intl: false,
          module: false,
          process: false,
          require: false,
          setImmediate: false,
          setInterval: false,
          setTimeout: false,
        },
        ["exports", "__dirname", "__filename", "module", "require"]
      )
    ).toEqual({
      Buffer: false,
      clearImmediate: false,
      clearInterval: false,
      clearTimeout: false,
      console: false,
      global: false,
      Intl: false,
      process: false,
      setImmediate: false,
      setInterval: false,
      setTimeout: false,
    });
  });

  it("should return really empty object for props=true", () => {
    class A {
      constructor(public sec: any) {}
    }

    expect(omit(A, true)).toEqual({});
  });

  it("not omitted properties should have same descriptors", () => {
    class A {
      static prop1 = 12;

      constructor(public sec: any) {}
    }

    const originalDescrs: any[] = [];
    const resultDescrs: any[] = [];

    const keys_ = Object.keys(omit(A, ["a"]));

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys_) {
      if (key !== "name") {
        originalDescrs.push(Object.getOwnPropertyDescriptor(A, key));
      }
    }

    const result = omit(A, ["name"]);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(result)) {
      resultDescrs.push(Object.getOwnPropertyDescriptor(result, key));
    }

    expect(resultDescrs).toEqual(originalDescrs);
  });
});
