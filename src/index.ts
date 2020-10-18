/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as fg from "fast-glob";
import { Container } from "inversify";
import fs from "fs";
import path from "path";

const json = fs.readFileSync("inversify.config.json");

let config: any = null;
try {
  config = JSON.parse(json.toString());
} catch (e) {
  console.error(
    "The 'inversify.config.json' file is not defined or invalid",
    e
  );
}

const dirname = require?.main?.filename || "";
const appDir = path.dirname(dirname);

export default class containerMap {
  static load(): Container {
    const diContainerMap = new Container();
    if (config) {
      fg.sync(config.map.include, {
        dot: true,
        onlyFiles: true,
        ignore: config.map.exclude,
      }).forEach((file) => {
        const fName = file.replace(/^.*[\\\/]/, "").replace(/\.[^.]*$/, "");
        const fPath = require(appDir +
          file.replace(".ts", "").replace("src", ""));
        const symbol = Symbol.for(fName);

        diContainerMap.bind(symbol).to(fPath[fName]);
      });
    }

    return diContainerMap;
  }
}
