# FGO Tools

This readme is meant for developers who want to contribute or are just curious to explore the site's code. If you're a user looking for information visit the site _link here soon™_

## Getting Started

First make sure you have nodejs and yarn installed, then clone and install the repository:

```shell
git clone git@github.com:mitsunee/fgo-tools.git
cd fgo-tools
yarn install
```

## Development Startup

Run `yarn dev` to start the development server locally on your system, then visit [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Paths and aliases

- assets: Contains raw assets and data for staticially generated pages
- pages: Contains all pages and api routes
- public: Contains files that will get served in `/` alongside the app
- scripts: Contains helper and data generation scripts
- src:
  - components: (alias `"@components"`) Contains React components. Note that as a convention only the `index.js` of each component is meant to be imported. This file should either default export the component or in rare cases named export the component and any Parent/Child components required to use it.
  - stores: (alias `"@stores"`) Contains all stores and their logic
  - styles: (alias `"@styles"`) Contains CSS Modules for all pages, the global stylesheet and theme config
  - utils: (alias `"@utils"`) contains utility functions
    - hooks: (alias `"@utils/hooks"`) contains React hooks

To make new pages and components you can use the `new` script. See `yarn new --help` for more inforation.

## Code Guidelines

- Use the included ESLint and Prettier configuations. `simple-git-hooks` will run all committed code through both tools as well.
- Use ESM's `import` and `export` for anything in `./pages` and `./src`. Only config files and scripts in `./scripts` should be using CommonJS' `require()` and `module.exports`.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.jsx` file extension.
- Try to keep functions small (and thus their purpose obvious and readable). If you absolutely need larger functions divide your code into sections and use comments to give them headlines such as `// handle args`.
