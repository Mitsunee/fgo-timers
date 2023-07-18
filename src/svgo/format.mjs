import { resolveConfig } from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { format as prettierFormat } from "prettier/standalone";

let config;
export async function getConfig() {
  const localConf = await resolveConfig(process.cwd());
  const config = Object.assign({ parser: "typescript" }, localConf, {
    plugins: [parserTypeScript, prettierPluginEstree]
  });

  return config;
}

export async function format(fileContent) {
  config ??= await getConfig();
  return prettierFormat(fileContent, config);
}
