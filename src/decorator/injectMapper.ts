import { inject } from "inversify";

/**
 * This method support the use of the class directly
 * @param classRef Reference of the class
 * @param contextName Name of the context to scope the class
 */
export default function injectMapper<T>(
  classRef: T,
  contextName?: string | symbol
) {
  let context = "";
  if (contextName) {
    if (typeof contextName === "symbol") {
      context = String(contextName).slice(7, -1) || "";
    } else {
      context = contextName;
    }
  }

  return inject(Symbol.for(context + ((classRef as unknown) as Function).name));
}
