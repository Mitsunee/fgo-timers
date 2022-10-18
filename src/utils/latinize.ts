import { latinize, LatinizeOptions } from "modern-diacritics";

const options: LatinizeOptions = {
  lowerCase: true,
  forceSingleSpace: true,
  trim: true,
  symbols: true
};

function wrappedLatinize(str: string) {
  return latinize(str, options);
}

export { wrappedLatinize as latinize };
