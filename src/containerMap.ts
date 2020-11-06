/* eslint-disable no-useless-escape */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as fg from "fast-glob";
import { Container } from "inversify";
import fs from "fs";
import "reflect-metadata";

const appRoot = process.env.PWD;

const json = fs.readFileSync(`${appRoot}/inversify.config.json`);

type includeType = string | string[];

type excludeType = string[];

interface IContext {
  name: string;
  include: includeType;
  exclude?: excludeType;
}

interface IConfig {
  map: {
    include?: includeType;
    exclude?: excludeType;
    contexts?: IContext[];
  };
}

let config: IConfig = {} as IConfig;

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

function mapper(
  include: string | string[],
  exclude?: string[],
  module?: string
) {
  fg.sync(include, {
    dot: true,
    onlyFiles: true,
    ignore: exclude,
    cwd: appRoot,
  }).forEach((file) => {
    const fName = file.replace(/^.*[\\\/]/, "").replace(/\.[^.]*$/, "");
    const fPath = require(appRoot +
      file.replace(".ts", "").replace("src", "/src"));
    const symbol = Symbol.for(module + fName);

    diContainerMap.bind(symbol).to(fPath[fName]);
  });
}

function load(): Container {
  if (config) {
    const hasContexts = config.map.contexts;

    if (hasContexts) {
      const contexts = config.map.contexts || [];

      contexts.forEach((context) => {
        mapper(context.include, context.exclude, context.name);
      });
    } else if (config.map.include) {
      mapper(config.map.include, config.map.exclude);
    }
  }

  return diContainerMap;
}

class ContainerMap {
  private diContainerMap: Container;

  constructor() {
    this.diContainerMap = load();
  }

  /**
   * Map the classes and return a container
   */
  load(): Container {
    return this.diContainerMap;
  }
}

export default ContainerMap;
