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
npm install nversify-mapper

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

const server = new InversifyExpressServer(containerMap.load());
```
