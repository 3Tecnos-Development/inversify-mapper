/* eslint-disable @typescript-eslint/ban-types */
import { injectable } from "inversify";
import { defaultStorage } from "../../storage/Storage";

/**
 * This decorator informs that the class will be injected using singleton
 */
export function injectableSingleton() {
  return (object: Object) => {
    defaultStorage.addSingleton({
      objectName: ((object as unknown) as Function)?.name,
    });

    injectable()(object);
  };
}
