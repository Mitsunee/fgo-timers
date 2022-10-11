import prettier from "prettier";

let config;
export async function getConfig() {
  const config = {
    parser: "babel",
    ...(await prettier.resolveConfig(process.cwd()))
  };

  return config;
}

export async function format(fileContent) {
  config ??= await getConfig();
  return prettier.format(fileContent, config);
}
