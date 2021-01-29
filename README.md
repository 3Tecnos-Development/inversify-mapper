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

## Use ContainerMap

Create the file "inversify.config.json", and do your mapping from controllers, services, adapter, etc. See e.g.

```json
{
  "map": {
    /* matches all files in the src directory (any level of nesting) that have the .ts or .js extension.*/
    "include": [
      "controllers/**/*Controller.{ts,js}",
      "services/**/*Service.{ts,js}"
    ],
    "exclude": ["**/BaseHttp*"]
  }
}
```

```typescript
import containerMap from "inversify-mapper";

const container = containerMap.load();
```

## Use ContainerMap with contexts

Create the file "inversify.config.json", and do your mapping from controllers, services, adapter, etc. See e.g.

> Note that this way you can to name your injectable or controller classes with same names and it will be not conflict or ambiguous in the loadind.

// inversify.config.json

```json
{
  "map": {
    "contexts": [
      {
        "name": "Vendor",
        /* matches all files in the src directory (any level of nesting) that have the .ts or .js extension.*/
        "include": [
          "vendor/controllers/**/*Controller.{ts,js}",
          "vendor/services/**/*Service.{ts,js}"
        ],
        "exclude": ["**/BaseHttp*"]
      },
      {
        "name": "Customer",
        "include": [
          "customer/controllers/**/*Controller.{ts,js}",
          "customer/services/**/*Service.{ts,js}"
        ],
        "exclude": ["**/BaseHttp*"]
      }
    ]
  }
}
```

// src/customer/services/AddSubscriptionService.ts

```typescript
import { inject, injectable } from "inversify";

@injectable()
export class AddSubscriptionService {
  constructor(
  ) {}

  async handle(data: Subscription): Promise<Subscription> {
	  ...
  }
```

// src/vendor/services/AddSubscriptionService.ts

```typescript
import { inject, injectable } from "inversify";

@injectable()
export class AddSubscriptionService {
  constructor(
  ) {}

  async handle(data: Subscription): Promise<Subscription> {
	  ...
  }
```

## Use injectMapper decorator

> Approach _without_ using the injectMapper decorator

// types.ts file

```typescript
let TYPES = {
  AddSubscriptionController: Symbol.for("AddSubscriptionController"),

  AddSubscriptionService: Symbol.for("AddSubscriptionService"),
  DeleteSubscriptionService: Symbol("DeleteSubscriptionService"),
  ListSubscriptionService: Symbol("ListSubscriptionService"),
};

export default TYPES;
```

// injection

```typescript
import { inject, injectable } from "inversify";

@injectable()
export class AddSubscriptionController {
  constructor(
	@inject(TYPES.AddSubscriptionService)
	private readonly addSubscription: IAddSubscriptionUseCase
  ) {}
```

> Approach using the injectMapper decorator

// types.ts file no needed

// injection

```typescript
import { injectable } from "inversify";
import { injectMapper } from "inversify-mapper";

@injectable()
export class AddSubscriptionController {
  constructor(
	@injectMapper(AddSubscriptionService)
	private readonly addSubscription: IAddSubscriptionUseCase
  ) {}
```

## Use injectMapper decorator with contexts

> _context_ => name of the context in "inversify.config.json" file

```typescript
@injectMapper(AddSubscriptionService, context)
```

##### Use

```typescript
import { injectable } from "inversify";
import { injectMapper } from "inversify-mapper";

@injectable()
export class AddSubscriptionController {
  constructor(
	@injectMapper(AddSubscriptionService, "Customer")
	private readonly addSubscription: IAddSubscriptionUseCase
  ) {}
```

## Use injectableSingleton decorator

> If you want to inject the class using Singleton, this is a very simple approach:

```typescript
import { injectMapper, injectableSingleton } from "inversify-mapper";

@injectableSingleton()
export class AddSubscriptionService {
  constructor(
	@injectMapper(AddSubscriptionRepository)
	private readonly addSubscription: IAddSubscriptionRepository
  ) {}
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

## Package in Production Enviroment

> :warning: Set the NODE_ENV=production environment variable. This package reads the 'outDir' property from your tsconfig.json file to get the root directory.

For the package to run correctly in production, assign a value in outDir

```json
{
  "compilerOptions": {
    "outDir": "dist" /* Redirect output structure to the directory. */
  }
}
```
