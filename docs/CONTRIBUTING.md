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

First make sure you have Node.js 18.x and pnpm (or corepack) installed, then clone and install the repository:

```shell
pnpm install
```

## Development Server Startup

Start the devServer with `pnpm dev` locally on your system, then visit [http://localhost:3000](http://localhost:3000) with your browser to see the result. `pnpm prebuild` is run automatically. You can re-run it in a differnt terminal to update the data. Pages will need to be refreshed to load in the new data!

## Directories in this repository

- assets: Contains all data assets, images in original resolution and currently unused images
- pages: Contains all Next.js Pages and API routes
- public: Contains files that will get served in `/` alongside the app
- src: Contains most of the source code, categorized losely by topic (such as "servants", or "items"):
  - atlas-api: Atlas Academy API Connector adapter and cache management
  - client: Frontend Components, hooks and stores
  - pages: page-specific utils and components
  - prebuild: Prebuild script that handles API data caching and reformatting into optimized data set
  - schema: Schema files and validation script, as well as a folder of automatically generated JSON schemas based on the zod schemas (see [generate-json-schemas.ts](../src/schema/generate-json-schema.ts))
  - server: tRPC routers
  - svgo: SVGO script that handles converting `.svg` files in the assets directory to React components
  - types: globally used types and Enums (note that there may also be files matching `src/*/types(.d)?.ts`)
  - utils: generic utils
- tests (mirrors src unless specified here):
  - Pages can omit the `pages` directory in the path here

## Environment Variables

Environment variables can be set in `.env` or via cli such as `FORCE_ATLAS_CACHE_UPDATE=true pnpm dev`.

- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Protocol `https://` will be autofilled if ommitted. `http://localhost:3000` is used as fallback if not set.
- `FORCE_ATLAS_CACHE_UPDATE`: If set to non-empty value will force a cache update when any script (such as prebuild) runs `prepareCache`.
- `SKIP_ATLAS_CACHE_UPDATE`: If set to non-empty value will forceskip checking for updates on the AtlasAcademy API. Is overriden by `FORCE_ATLAS_CACHE_UPDATE` if both are set.

## Code Guidelines

- Use `import type` whenever possible. Values imported as type are removed during the build process and are thus removed from production bundles.
- Import aliases are preferred if you are navigating up more than one layer of directories (i.e. use `~/utils` over `../../utils`)
- Use the included ESLint and Prettier configuations. Remember to use `pnpm lint` and `pnpm typecheck` before pushing.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.tsx` file extension.
- Deployments are static thus files in `./assets` should only be written to during the prebuild step! (this means there is currently no way to update upgrades other then redeployment)
- Should you need to add or update dependencies please also run `npx update-browserslist-db@latest` and `pnpm dedupe` before committing.

## Scripts/Testing

The following scripts are available in this project:

- Preparation `pnpm prepare` / `pnpm prepare:cache`
- Utility Scripts
  - Find Script `pnpm find` (utility to help find IDs for game entities such as Servant, CEs or Items)
  - Check Event Script `pnpm check-event` (utility to help find unused timestamps in events)
  - JSON Schema Build Script `pnpm build:schema` (may require running `pnpm format` after)
- Testing
  - Typechecks `pnpm typecheck`
  - Linting/Formatting `pnpm lint` or `pnpm lint:strict`, `pnpm format` or `pnpm format:check`
  - Tests `pnpm test:code` for code tests, `pnpm test:data` for schema checks
- Building `pnpm prebuild`, `pnpm build:svgo`, `pnpm build`
  - Start `pnpm start` (starts a build of the Next.js app)

## Further Information

**NOTE**: There is currently an ongoing migration to the following tools: TypeScript, zod, tRPC. Documentation may not be up-to-date yet.

### Project Documation

- [News Post Scraping](news-post-scraping.md) contains code examples for scraping data from official news posts.
- [Time Formats](./data/time-formats.md): Time Formats used in project
- [Event Files](./data/events.md): Events File Format
- [Themeing and Responsive Design](./theme.md): Information on global css properties used for Themeing.

### External References

- [Atlas Academy DB](https://apps.atlasacademy.io/db/) can be used to find Servant and Craft Essence IDs more quickly. Usually both ID and collectionNo are supported, but scripts prefer using the ID.
- [Atlas Academy API Documentation](https://api.atlasacademy.io/docs#/)
