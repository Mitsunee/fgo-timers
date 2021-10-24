const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

// fetch configs
const prettierConfig = {
  parser: "babel",
  ...prettier.resolveConfig.sync(process.cwd())
};

// fetch args
const [, , option, ...args] = process.argv;

// log helper function
function log(message, color) {
  if (!color || !chalk[color]) {
    console.log(message);
    return;
  }
  console.log(chalk[color](message));
}

// path helper function
function resolvePath(...relativePath) {
  return path.join(process.cwd(), ...relativePath);
}

// helper function to write files
function writeFile(dirPath, name, code) {
  const fullPath = path.join(dirPath, name);
  if (fs.existsSync(fullPath)) return false; // don't override existing files!
  fs.writeFileSync(
    fullPath,
    name.endsWith(".css") ? code : prettier.format(code, prettierConfig)
  );
  log(`Created: .${fullPath.substring(process.cwd().length)}`);
}

function sanitizeComponentName(name) {
  return name.replace(/[^a-z]/gi, "").replace(/^[a-z]/, c => c.toUpperCase());
}

function sanitizePageFileName(name) {
  return path.join(
    path.dirname(name),
    `${path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z]/g, "")}.jsx`
  );
}

const handleOption = {
  help: () => {
    log("new\n", "bold");
    log("  yarn new option ...arguments\n");
    log("options:", "bold");
    log("  --help, -h, help: Shows this help text");
    log("  --component, -c, component: Create a new React Component");
    log("    -c componentName [...childName]");
    log("      componentName: Name of the globally accessible Component");
    log("      childName (optional): Names of any child components");
    log("  --page, -p, page: Create a new Next page");
    log("    -p fileName componentName");
    log("      fileName: file name of the page");
    log("      componentName: React Component name");
  },
  component: args => {
    const [parent, ...children] = args;
    const parentComponent = sanitizeComponentName(parent);
    const childComponents = children
      ? children.map(child => sanitizeComponentName(child))
      : [];
    const dirPath = resolvePath("src/components", parentComponent);
    fs.mkdirSync(dirPath, { recursive: true });

    // index.js
    writeFile(
      dirPath,
      "index.js",
      `import ${parentComponent} from "./${parentComponent}"; export default ${parentComponent}`
    );

    // children
    for (const childComponent of childComponents) {
      writeFile(dirPath, `${childComponent}.module.css`, "");
      writeFile(
        dirPath,
        `${childComponent}.jsx`,
        `import styles from "./${childComponent}.module.css"\n\nexport default function ${childComponent}() {return null}`
      );
    }

    // parent
    writeFile(dirPath, `${parentComponent}.module.css`, "");
    writeFile(
      dirPath,
      `${parentComponent}.jsx`,
      `import styles from "./${parentComponent}.module.css";${childComponents
        .map(
          childComponent =>
            `import ${childComponent} from "./${childComponent}";`
        )
        .join(
          ""
        )}\n\nexport default function ${parentComponent}() {return null}`
    );
  },
  page: (fileNameArg, componentNameArg) => {
    if (!fileNameArg || !componentNameArg) {
      log(
        "Must provide both arguments for 'page' option. See yarn new --help",
        "red"
      );
      return false;
    }
    const dirPath = resolvePath("pages", path.dirname(fileNameArg));
    fs.mkdirSync(dirPath, { recursive: true });
    const componentName = sanitizeComponentName(componentNameArg);
    const fileName = sanitizePageFileName(path.basename(fileNameArg));

    writeFile(resolvePath("src", "styles"), `${componentName}.module.css`, "");
    writeFile(
      dirPath,
      fileName,
      `import styles from "@styles/${componentName}.module.css"\n\nexport default function ${componentName}() {return null}`
    );
  }
};

// errorhandle args
if (args.length < 1 && !["-h", "help", "--help"].includes(option)) {
  log("Must provide at least option and one argument\n", "red");
  handleOption.help();
  process.exit(1);
}

// handle args
switch (option) {
  case "-h":
  case "help":
  case "--help":
    handleOption.help();
    break;
  case "-c":
  case "component":
  case "--component":
    handleOption.component(args);
    break;
  case "-p":
  case "page":
  case "--page":
    handleOption.page(...args);
    break;
  default:
    log("Unrecognized option\n", "red");
    handleOption.help();
    process.exit(1);
}
