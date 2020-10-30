/* eslint-disable no-useless-escape */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as fg from "fast-glob";
import { Container, inject } from "inversify";
import fs from "fs";
import "reflect-metadata";

const appRoot = process.env.PWD;

const json = fs.readFileSync(`${appRoot}/inversify.config.json`);

let config: { map: { include: string | string[]; exclude: any } } | null = null;

try {
  config = JSON.parse(json.toString());
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(
    "The 'inversify.config.json' file is not defined or invalid",
    e
  );
}

export default class containerMap {
  static load(): Container {
    const diContainerMap = new Container();
    if (config) {
      fg.sync(config.map.include, {
        dot: true,
        onlyFiles: true,
        ignore: config.map.exclude,
        cwd: appRoot,
      }).forEach((file) => {
        const fName = file.replace(/^.*[\\\/]/, "").replace(/\.[^.]*$/, "");
        const fPath = require(appRoot +
          file.replace(".ts", "").replace("src", "/src"));
        const symbol = Symbol.for(fName);

        diContainerMap.bind(symbol).to(fPath[fName]);
      });
    }

    return diContainerMap;
  }
}

function injectMapper<T>(Instance: T) {
  return inject(Symbol.for(((Instance as unknown) as Function).name));
}

export { injectMapper };
