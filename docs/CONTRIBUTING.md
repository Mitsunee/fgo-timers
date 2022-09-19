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
- pages: Contains all pages and api routes
- public: Contains files that will get served in `/` alongside the app
- src:
  - client: Frontend Components and stores
  - scripts: Scripts for various tasks in this repository (such as build data bundles)
  - server: SSG, ISR and related util functions
- tests:
  - \_\_mockups\_\_: Contains mock assets used in tests
  - scripts: Contains all tests for utils used by scripts in `./src/scripts`. Uses `uvu` test runner via `yarn test:scripts`
  - server: Contains all tests for SSG and ISR functions

## Environment Variables

- `NEXT_PUBLIC_DOMAIN`: Domain name used for meta images. Do not include any preceeding or following slashes or protocols. The protocol `https://` will be used by the Meta component.

## Code Guidelines

- Use the included ESLint and Prettier configuations. `simple-git-hooks` will run all committed code through both tools as well.
- As a general rule of thumb default exports are only used in React Components, NextJS API Routes and NextJS Pages. All other exports should be named exports.
- All files using JSX should use the `*.jsx` file extension.
- Try to keep functions small (and thus their purpose obvious and readable). If you absolutely need larger functions divide your code into sections and use comments to give them headlines such as `// handle args`.
- Deployments are static thus files in `./assets` should only be written to during the prebuild step! (this means there is currently no way to update upgrades other then redeployment)

## Further Information

**NOTE**: The backend is currently undergoing a major rewrite, documentation may be deprecated!

[News Post Scraping](news-post-scraping.md) contains information for scraping data from official news posts.

[Atlas Academy DB](https://apps.atlasacademy.io/db/) can be used to find Servant and Craft Essence IDs more quickly. Usually both ID and collectionNo are supported, but scripts prefer using the ID.

Refer to the [Atlas Academy API Documentation](https://api.atlasacademy.io/docs#/) for data types. (Going to migrate to `@atlasacademy/api-connector` soon-ish)
