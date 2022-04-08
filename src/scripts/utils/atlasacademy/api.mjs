import "picoapi/node-polyfill";
import { createApi } from "picoapi";

// TODO: add default headers when that feature is added to picoapi

const basePath = "https://api.atlasacademy.io";

// nice endpoints
export const atlasNa = createApi(`${basePath}/nice/NA`);
export const atlasJp = createApi(`${basePath}/nice/JP`);

// basic endpoints
export const atlasBasicNa = createApi(`${basePath}/basic/NA`);
export const atlasBasicJp = createApi(`${basePath}/basic/JP`);

// exports endpoints
export const atlasExport = createApi(`${basePath}/export`); // NOTE: add transformer to enforce .json ext
