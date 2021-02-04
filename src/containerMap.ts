/* eslint-disable no-useless-escape */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as fg from "fast-glob";
import { Container } from "inversify";
import fs from "fs";
import "reflect-metadata";
import { defaultStorage } from "./storage/Storage";
import { ITsConfig } from "./interfaces/ITsConfig";

const appRoot = process.env.PWD || process.cwd();

const json = fs.readFileSync(`${appRoot}/inversify.config.json`);

type includeType = string[];

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

/**
 * Read a json file and remove comments
 */
function requireJSON(jsonContent: string) {
  return JSON.parse(
    jsonContent.replace(
      /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
      (m, g) => (g ? "" : m)
    )
  );
}

try {
  config = requireJSON(json.toString());
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(
    "The 'inversify.config.json' file is not defined or invalid",
    e
  );
}

const diContainerMap: Container = new Container();

function getTsConfigObject(): ITsConfig {
  const tsConfigFilePath = `${appRoot}/tsconfig.json`;
  const hasTsConfigFile = fs.existsSync(tsConfigFilePath);
  if (!hasTsConfigFile) {
    throw new Error("'tsconfig.json' file is not found.");
  }
  const tsConfigFile = fs.readFileSync(tsConfigFilePath);
  return requireJSON(tsConfigFile.toString());
}

function getBasePath(): string {
  const environment = process.env.NODE_ENV;
  const isProduction = environment === "production";

  if (isProduction) {
    const { outDir } = getTsConfigObject().compilerOptions;

    if (!outDir) {
      throw new Error(
        "'outDir' is not defined. Set the outDir property in the tsconfig file."
      );
    }

    return outDir;
  }

  // Development default path
  return "src";
}

function importFrom(file: string) {
  const fullPath = `${appRoot}/${file.replace(".ts", "").replace(".js", "")}`;
  return require(fullPath);
}

function resolvePathFromBase(
  paths: string[] | undefined
): string[] | undefined {
  if (paths) {
    const result: string[] = [];
    const basePath = getBasePath();
    paths.forEach((path) => {
      const hasBasePath =
        path.length >= basePath.length &&
        path.substring(0, basePath.length) === basePath;

      if (hasBasePath) {
        result.push(path);
      } else {
        result.push(`${basePath}/${path}`);
      }
    });
    return result;
  }
  return undefined;
}

function getClassNameFromFile(file: string, importedFile: any): string {
  const fileName = file
    .replace(/^.*[\\\/]/, "")
    .replace(/\.[^.]*$/, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  const filtered = Object.keys(importedFile).filter(
    (key) => fileName === key.toLowerCase()
  );
  return filtered.length > 0 ? filtered[0] : "";
}

function mapper(include: string[], exclude?: string[], module: string = "") {
  const resolvedInclude = resolvePathFromBase(include);
  const resolvedExclude = resolvePathFromBase(exclude);

  fg.sync(resolvedInclude!, {
    dot: true,
    onlyFiles: true,
    ignore: resolvedExclude,
    cwd: appRoot,
  }).forEach((file) => {
    const importedFile = importFrom(file);
    const className = getClassNameFromFile(file, importedFile);
    const symbol = Symbol.for(module + className);

    const isSingleton = defaultStorage.hasSingleton({
      objectName: className,
    });

    if (isSingleton) {
      diContainerMap
        .bind(symbol)
        .to(importedFile[className])
        .inSingletonScope();
    } else {
      diContainerMap.bind(symbol).to(importedFile[className]);
    }
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
