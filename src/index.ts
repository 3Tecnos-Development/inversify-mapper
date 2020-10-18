/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as fg from "fast-glob";
import { Container } from "inversify";

const path = require("path");

const config = require(path.resolve(__dirname, "../inversify.config.json"));

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
        const fPath = require(file.replace(".ts", "").replace("src", "."));
        const symbol = Symbol.for(fName);

        diContainerMap.bind(symbol).to(fPath[fName]);
      });
    }

    return diContainerMap;
  }
}
