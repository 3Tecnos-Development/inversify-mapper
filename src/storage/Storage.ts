/* eslint-disable @typescript-eslint/ban-types */
import { ISingletonStorage } from "../interfaces/ISingletonStorage";

class Storage {
  private singletonCollection: ISingletonStorage[] = [];

  hasSingleton(item: ISingletonStorage): boolean {
    return this.singletonCollection.some(
      (i) => i.objectName === item.objectName
    );
  }

  addSingleton(newItem: ISingletonStorage) {
    if (!this.hasSingleton(newItem)) {
      this.singletonCollection.push(newItem);
    }
  }
}

export const defaultStorage = new Storage();
