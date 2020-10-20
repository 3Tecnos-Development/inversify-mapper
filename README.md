<h3 align="center">inversify-mapper</h3>
<p align="center">Mapper from Container to inversify</p>

<p align="center">
  <a href="https://www.npmjs.com/package/inversify-mapper">
    <img src="https://img.shields.io/npm/v/inversify-mapper.svg" alt="NPM">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT">
  </a>
</p>

## Installation

Install via NPM:

```bash
npm install inversify-mapper

```

## Use

Create the file "inversify.config.json", and do your mapping from controllers, services, adapter, etc. See e.g.

```json
{
  "map": {
    "include": [
      "src/controllers/**/*Controller.ts",
      "src/services/**/*Service.ts"
    ],
    "exclude": ["**/BaseHttp*"]
  }
}
```

```typescript
import containerMap from "inversify-mapper";

const container = containerMap.load();
```

## Disclaimer

> If you use alias path to the directories in your ts-config, it is need to do some addition config. See it below:

tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/core/*"],
      "@common/*": ["src/common/*"],
      "@infra/*": ["src/infra/*"],
      "@application/*": ["src/application/*"],
      "@test/*": ["test/*"]
    }
  }
}
```

## Solution

Use the lib "[link-module-alias](https://www.npmjs.com/package/link-module-alias)" to make the mapping.

```bash
npm i --save-dev link-module-alias
```

### e.g.

package.json

```json
{
  "scripts": {
    "postinstall": "link-module-alias"
  },
  "_moduleAliases": {
    "@core": "src/core",
    "@common": "src/common",
    "@infra": "src/infra",
    "@application": "src/application"
  }
}
```

And so just execute once time, or always that you change your mapping

```bash
npm run postinstall
```
