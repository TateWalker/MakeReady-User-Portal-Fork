function isFunction(val: any): val is Function {
  return typeof val === "function";
}

export function when<TTest, T, U>(
  condition: TTest | null | undefined,
  value: ((condition: TTest) => T) | T
): T | U | undefined;
export function when<TTest, T, U>(
  condition: TTest | null | undefined,
  value: ((condition: TTest) => T) | T,
  otherwise: (() => U) | U
): T | U;

/**
 * Cleans up ternary operators in JSX with a when statement. First argument is
 * any truthy value and the value is either the value directly or a callback
 * returning the value.
 *
 * Use a callback to prevent evaluation of the value if the condition does not
 * return. Use a value and not a callback if there is no evaluation when the
 * value is returned.
 *
 * An example of when it's better to not evaluate the returned value is when the
 * value is JSX where inherent React.createElements will be called if just a
 * value was returned.
 */
export function when<TTest, T, U>(
  condition: TTest | null | undefined,
  value: ((condition: TTest) => T) | T,
  otherwise?: (() => U) | U
): T | U | undefined {
  if (condition) {
    if (isFunction(value)) {
      return value(condition);
    } else {
      return value;
    }
  } else if (otherwise) {
    if (isFunction(otherwise)) {
      return otherwise();
    } else {
      return otherwise;
    }
  }

  return;
}

type ClassOption =
  | string
  | undefined
  | null
  | Record<string, boolean | null | undefined>;

function isString(v: any): v is string {
  return v.charCodeAt !== void 0;
}

/**
 * This takes several arguments and concatenates them into a single css class
 * name compatible string. It will remove any falsy values and will trim any
 * whitespace.
 */
export function classnames(...str: ClassOption[]): string {
  let out = "";
  let c, k;
  let i = 0;
  const iMax = str.length;

  while (i < iMax) {
    if ((c = str[i++])) {
      if (isString(c)) {
        out && (out += " ");
        out += c;
      } else {
        for (k in c) {
          if (c[k]) {
            out && (out += " ");
            out += k;
          }
        }
      }
    }
  }

  return out;
}
