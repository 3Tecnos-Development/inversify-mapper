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

const diContainerMap: Container = new Container();

function load(): Container {
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

class ContainerMap {
  private diContainerMap: Container;

  constructor() {
    this.diContainerMap = load();
  }

  load(): Container {
    return this.diContainerMap;
  }
}
const containerMap = new ContainerMap();
export default containerMap;

function injectMapper<T>(Instance: T) {
  return inject(Symbol.for(((Instance as unknown) as Function).name));
}

export { injectMapper };
