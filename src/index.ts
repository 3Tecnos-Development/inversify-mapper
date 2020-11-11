/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import ContainerMap from "./containerMap";
import injectMapper from "./decorator/injectMapper";

const containerMap = new ContainerMap();

export default containerMap;

export { containerMap, injectMapper };
