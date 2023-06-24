# Info for Contributors

This file contains general information for getting started working with the code in this repository.

## Contribution Guidelines

**Open an issue or ask to be assigned to an issue before sending a Pull Request. When you have been assigned an Issue follow the steps below.**

Create a fork of this repository on GitHub and clone it.

<details>
<summary>Git instructions</summary>

### Add upstream remote:

```shell
git remote add upstream git@github.com/mitsunee/fgo-timers.git
git fetch upstream
```

### Updating your fork:

```shell
git fetch upstream
git checkout main
git rebase upstream/main
git push -u origin main
pnpm install
```

### Creating a branch

(replace BRANCH_NAME accordingly):

```shell
git branch BRANCH_NAME
git checkout BRANCH_NAME
git push -u origin BRANCH_NAME
```

### Rebasing dev branch:

```shell
git checkout BRANCH_NAME
git fetch upstream
git rebase upstream/main # follow instructions if merge conflicts appear
```

</details>

After pushing changes to your dev branch you can open a Pull Request on GitHub.

## Getting Started

First make sure you have Node.js 16.x and pnpm (or corepack) installed, then clone and install the repository:

```shell
pnpm install
cp .env.example .env.local
YOUR_EDITOR .env.local # adjust values if needed
```

## Development Server Startup

Start the devServer with `pnpm dev` locally on your system, then visit [http://localhost:3000](http://localhost:3000) with your browser to see the result. `pnpm prebuild` is run automatically. You can re-run it in a differnt terminal to update the data.

## Directories in this repository

- assets: Contains all data assets, images in original resolution and currently unused images
- pages: Contains all pages and api routes (may adopt Next.js 13 app directory in the future)
- public: Contains files that will get served in `/` alongside the app
- src:
  - atlas-api: Atlas Academy API Connector adapter and cache management
  - client: Frontend Components, hooks and stores
  - events: Utils for handling (ingame) Events
  - items: Utils for Craft Essences, Items and Custom Items
  - pages: page-specific utils and components
  - prebuild: Prebuild script that handles API data caching and reformatting into optimized data set
  - schema: Schema files and validation script
  - scripts: Legacy Location for scripts that have not been fully migrated to zod/typescript
  - servants: Utils for handling Servants, Noble Phantasms and Skills
  - server: tRPC routers, also Legacy Location for SSG, ISR and related util functions
  - svgo: SVGO script that handles converting `.svg` files in the assets directory to React components
  - time: utils for working with timestamps, and Date strings
  - types: globally used types and Enums (note that there may also be files matching `src/*/types(.d)?.ts`)
  - upgrades: Utils for handling Quests and Upgrades (Interludes and Rank Ups)
  - utils: generic utils
- tests (mirrors src unless specified here):
  - Pages can omit the `pages` directory in the path here

## Environment Variables

- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Protocol `https://` will be autofilled if ommitted. `http://localhost:3000` is used as fallback if not set.
- `FORCE_ATLAS_CACHE_UPDATE`: If set to non-empty value will force a cache update when any script (such as prebuild) runs `prepareCache`.

## Code Guidelines

- Use absolute import paths such as `import { api } from "src/client/api"`. The current aliases are deprecated and will be replaced in the future.
- Use `import type` whenever possible. Values imported as type are removed during the build process and are thus removed from production bundles.
- New code should use typescript - migration from esm to ts is currently in progress
- Use the included ESLint and Prettier configuations. Remember to use `pnpm lint` and `pnpm test:types` before pushing.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.jsx` or `*.tsx` file extension.
- Try to keep functions small (and thus their purpose obvious and readable). If you absolutely need larger functions divide your code into sections and use comments to give them headlines such as `// handle args`.
- Deployments are static thus files in `./assets` should only be written to during the prebuild step! (this means there is currently no way to update upgrades other then redeployment)
- Should you need to add or update dependencies please also run `npx update-browserslist-db@latest` and `pnpm dedupe` before committing.

## Workflow and Testing

The build process has the following steps:

- Typechecks `pnpm test:types`
- Legacy Tests (deprecated tests that will be rewritten) `pnpm test:legacy`
- Testing `pnpm test:code`
- Data Testing `pnpm test:data` (tests data in `./assets/` using the check script, see `--help` for more information)
- Prebuild `pnpm prebuild` (runs prebuild script)
- Build `pnpm build` (builds next app)

## Further Information

**NOTE**: There is currently an ongoing migration to the following tools: TypeScript, zod, tRPC. Documentation may not be up-to-date yet.

Documentation on scripts (such as `pnpm find` and `pnpm build:svgo`) have also not been written yet, but may be present in source code. Refer to [package.json](../package.json) to see what's available. Note that currently some scripts still have some `.mjs` files and thus use `tsm` to run. This will be replaced with `tsx` in the future.

### Project Documation

- [News Post Scraping](news-post-scraping.md) contains code examples for scraping data from official news posts.
- [Time Formats](./data/time-formats.md): Time Formats used in project
- [Event Files](./data/events.md): Events File Format
- [Themeing and Responsive Design](./theme.md): Information on global css properties used for Themeing.

### External References

- [Atlas Academy DB](https://apps.atlasacademy.io/db/) can be used to find Servant and Craft Essence IDs more quickly. Usually both ID and collectionNo are supported, but scripts prefer using the ID.
- [Atlas Academy API Documentation](https://api.atlasacademy.io/docs#/)
