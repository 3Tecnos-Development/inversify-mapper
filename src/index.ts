/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import dotenv from "dotenv";
import ContainerMap from "./containerMap";
import { injectableSingleton, injectMapper } from "./decorators";

dotenv.config();

const containerMap = new ContainerMap();

export default containerMap;

export { containerMap, injectMapper, injectableSingleton };
