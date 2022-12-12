# Info for Contributors

This file contains general information for getting started working with the code in this repository.

## Contribution Guidelines

**Open an issue or ask to be assigned to an issue before sending a Pull Request. When you have been assigned an Issue follow the steps below.**

Create a fork of this repository on GitHub and clone it. Then use the following commands to create a dev branch on your fork:

```shell
# Add upstream remote:
git remote add upstream git@github.com/mitsunee/fgo-timers.git
git fetch upstream

# Updating your fork:
git fetch upstream
git checkout main
git rebase upstream/main
git push -u origin main
yarn

# Creating a branch (replace BRANCH_NAME accordingly):
# update your fork first!
git branch BRANCH_NAME
git checkout BRANCH_NAME
git push -u origin BRANCH_NAME

# Rebasing dev branch:
git checkout BRANCH_NAME
git fetch upstream
git rebase upstream/main # follow instructions if merge conflicts appear
```

After pushing changes to your dev branch you can open a Pull Request on GitHub.

## Getting Started

First make sure you have Node.js 16.x and yarn (or corepack) installed, then clone and install the repository:

```shell
yarn install
cp .env.example .env.local
YOUR_EDITOR .env.local # adjust values if needed
```

## Development Server Startup

Start the devServer with `yarn dev` locally on your system, then visit [http://localhost:3000](http://localhost:3000) with your browser to see the result. `yarn prebuild` is run automatically. You can re-run it in a differnt terminal to update the data.

## Directories in this repository

**Note:** Directory Structure is currently changing, docs will be updated later

- assets: Contains all data assets, images in original resolution and currently unused images
- pages: Contains all pages and api routes (may adopt Next.js 13 app directory in the future)
- public: Contains files that will get served in `/` alongside the app
- src:
  - atlas-api: Atlas Academy API Connector adapter and cache management
  - client: Frontend Components and stores
  - items: Utils for Craft Essences, Items and Custom Items
  - pages: Temporary Location for SSG, page-specific utils and page-specific components (will be moved to `./app` when migrating to that)
  - prebuild: Prebuild script that handles API data caching and reformatting into optimized data set
  - schema: Schema files and validation script
  - scripts: Legacy Location for scripts that have not been fully migrated to zod/typescript
  - servants: Utils for Servants, Noble Phantasms and Skills
  - server: Legacy Location for SSG, ISR and related util functions
  - types: globally used types and Enums (note that there may also be files matching `src/*/types(.d)?.ts`)
  - upgrades: utils related to Quests and Upgrades (Interludes and Rank Ups)
  - utils: generic utils
- tests (mirrors src unless specified here):
  - \_\_mockups\_\_: Contains mock assets used in legacy tests (ignored by jest config)
  - scripts-uvu: Contains all legacy tests (ignored by jest config)

Note: As of Next.js 13 the `./app` directory will not yet be used, but complex pages may use `./src/pages` to hold their specific styles, components and utils.

## Environment Variables

- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Do not include any preceeding or following slashes or protocols. The protocol `https://` will be used by the Meta component.

## Code Guidelines

- New code should use typescript - migration from esm to ts is currently in progress
- Use the included ESLint and Prettier configuations. `simple-git-hooks` will run all committed code through both tools as well.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.jsx` or `*.tsx` file extension.
- Try to keep functions small (and thus their purpose obvious and readable). If you absolutely need larger functions divide your code into sections and use comments to give them headlines such as `// handle args`.
- Deployments are static thus files in `./assets` should only be written to during the prebuild step! (this means there is currently no way to update upgrades other then redeployment)
- Should you need to add or update dependencies please also run `yarn browserslist --update-db` and `yarn-deduplicate` before committing.

## Workflow and Testing

The build process has the following steps:

- Typechecks `yarn test:types`
- Legacy Tests (deprecated tests that will be rewritten) `yarn test:legacy`
- Testing `yarn test:code`
- Data Testing `yarn test:data` (tests data in `./assets/` using the check script, see `--help` for more information)
- Prebuild `yarn prebuild` (runs prebuild script)
- Build `yarn build` (builds next app)

## Further Information

**NOTE**: The backend is currently undergoing a major rewrite, documentation may be deprecated!

- [News Post Scraping](news-post-scraping.md) contains information for scraping data from official news posts.
- [Atlas Academy DB](https://apps.atlasacademy.io/db/) can be used to find Servant and Craft Essence IDs more quickly. Usually both ID and collectionNo are supported, but scripts prefer using the ID.
- [Atlas Academy API Documentation](https://api.atlasacademy.io/docs#/)
- See [Themeing and Responsive Design](theme.md) for information on global css properties used for Themeing.
