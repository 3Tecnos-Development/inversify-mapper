/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import ContainerMap from "./containerMap";
import { injectableSingleton, injectMapper } from "./decorators";

const containerMap = new ContainerMap();

export default containerMap;

export { containerMap, injectMapper, injectableSingleton };
