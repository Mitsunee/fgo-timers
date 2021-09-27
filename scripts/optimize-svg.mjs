import { optimize, loadConfig } from "svgo";
import { readFile, lstat, readdir, writeFile } from "fs/promises";
import path from "path";
import { red, cyan } from "nanocolors";

const [, , ...arg] = process.argv;
const config = loadConfig();

async function resolveFilePath(filePath) {
  // make sure we have the absolute path to the file
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  try {
    const stat = await lstat(fullPath);

    // if the path is a valid file return the absolute path
    if (
      stat.isFile() &&
      path.extname(fullPath) === ".svg" &&
      !fullPath.endsWith(".inkscape.svg")
    ) {
      return [fullPath];
    }

    // if the path is a directory recursively call self on the contents of the dir
    if (stat.isDirectory()) {
      const dir = await readdir(fullPath);
      return (
        await Promise.all(
          dir.map(
            async file => await resolveFilePath(path.join(fullPath, file))
          )
        )
      ).flat();
    }

    // return empty array if no valid files were found at the path
    return [];
  } catch (e) {
    // if any errors occured assume file is not valid
    return [];
  }
}

async function optimizeFile(filePath) {
  try {
    const fileContent = await readFile(filePath, "utf8");
    const optimized = optimize(fileContent, await config);
    await writeFile(filePath, optimized.data, "utf8");
  } catch (e) {
    throw new Error(`During optimization of '${filePath}':\n${e}`);
  }
}

async function main(arg) {
  if (arg.length === 0) {
    throw new Error("No arguments were specified.");
  }

  // get list of valid files
  const files = (
    await Promise.all(arg.map(async file => await resolveFilePath(file)))
  ).flat(); // turns out flatMap doesn't work with Promise.all, so .flat() is used here

  if (files.length === 0) {
    throw new Error("No svg files could be found.");
  }

  for (const file of files) {
    await optimizeFile(file);
    console.log(cyan(`Optimized '${path.basename(file)}'`));
  }
}

main(arg).catch(e => {
  console.error(red(e));
  process.exit(1);
});
