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
  let prefix = "";

  if (contextName && typeof contextName === "symbol") {
    prefix = String(contextName).slice(7, -1) || "";
  }

  return inject(Symbol.for(prefix + ((classRef as unknown) as Function).name));
}
