# Info for Contributors

This file contains general information for getting started working with the code in this repository.

## Getting Started

First make sure you have nodejs, yarn and redis installed, then clone and install the repository:

```shell
git clone git@github.com:mitsunee/fgo-tools.git
cd fgo-tools
yarn install
```

This project uses [redis](https://redis.io/) for caching. To set up redis copy the `.env.example` file to `.env.local` and edit the `REDIS_URL` key to point to your testing instance. Feel free to make a directory `.dev` to store your redis config and `dump.rdb` files.

## Development Server Startup

Start your redis server and then run `yarn dev:data` and `yarn dev` in separate terminals to start the development servers locally on your system, then visit [http://localhost:3000](http://localhost:3000) with your browser to see the result. If you do not intend to edit data assets (in `./assets/`) you may choose to run `yarn prebuild` once instead of keeping `yarn dev:data` open.

## Directories in this repository

**Note:** Directory Structure is currently changing, docs will be updated later

- assets: Contains all data assets, images in original resolution and currently unused images
- pages: Contains all pages and api routes
- public: Contains files that will get served in `/` alongside the app
- scripts: (deprecated) old nodejs scripts that haven't been ported yet
- src:
  - components: Contains React components. Note that as a convention only the `index.js` of each component is meant to be imported
  - scripts: MJS scripts for various tasks in this repository (such as build data bundles)
  - server: new location for all SSG, SSR and related util functions
  - stores: Contains all stores and their logic
  - styles: Contains CSS Modules for all pages, the global stylesheet and theme configs
  - utils: Contains utility functions
    - hooks: contains React hooks
    - server: old SSG utils (currently getting rewritten)
- tests:
  - \_\_mockups\_\_: Contains mock assets used in tests
  - scripts: Contains all tests for utils used by scripts in `./src/scripts`. Uses `uvu` test runner via `yarn test:scripts`

## Environment Variables

- `REDIS_URL`: `redis://` or `rediss://` url to the redis server to be used for caching.
- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Do not include any preceeding or following slashes or protocols. The protocol `https://` will be used by the Meta component. (not used in development)

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
