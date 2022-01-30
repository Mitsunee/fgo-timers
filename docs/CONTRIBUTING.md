# Info for Contributors

This file contains general information for getting started working with the code in this repository.

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
- scripts: Contains project and data generation scripts as well as their utilities
  - note that all files in here should be ESM and use the `.mjs` file extension. They are currently not compatible with utils in `./src/utils`!
- src:
  - components: (alias `"@components"`) Contains React components. Note that as a convention only the `index.js` of each component is meant to be imported. This file should either default export the component or in rare cases named export the component and any Parent/Child components intended to be used with it.
  - server: new location for all SSG, SSR and related util functions
  - stores: (alias `"@stores"`) Contains all stores and their logic
  - styles: (alias `"@styles"`) Contains CSS Modules for all pages, the global stylesheet and theme configs
  - utils: (alias `"@utils"`) contains utility functions
    - hooks: contains React hooks
    - server: old SSG utils (currently getting rewritten)

To make new pages and components you can use the `new` script. See `yarn new --help` for more inforation.

## Environment Variables

- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Do not include any preceeding or following slashes or protocols. The protocol `https://` will be used by the Meta component.

## Code Guidelines

- Use the included ESLint and Prettier configuations. `simple-git-hooks` will run all committed code through both tools as well.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.jsx` file extension.
- Try to keep functions small (and thus their purpose obvious and readable). If you absolutely need larger functions divide your code into sections and use comments to give them headlines such as `// handle args`.

## Further Information

### Data Formats

**NOTE**: The backend is currently undergoing a major rewrite, documentation may be deprecated!

- Event Data: [events](events.md)
- Upgrades Data: [upgrades](upgrades.md)
