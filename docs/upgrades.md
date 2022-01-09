# Upgrades

Upgrades are generated by the `update:upgrades` script and saved to `./assets/data/upgrades/upgrades.json`.

## Release Time overrides

Due to game data containing placeholder dates and sometimes JP times it many times are overridden. During generation the script checks the `questDatesMap` Map in `./scripts/upgrades/questDatesMap.mjs`.

## Data Typing

See [upgrades.d.ts](../assets/data/upgrades/upgrades.d.ts) for static typing and information on the structure of the data.

## Static Generation

The following steps are taken during static generation (`getStaticProps`):

- Filter out Main Quests (no `target` prop)
- for every upgrade with no/falsey `na` prop:
  - add `JP_TO_NA_ESTIMATE` constant to `upgrade.quest.open`

## Refetch Conditions

Upgrade data will be replaced if at least one of these conditions is met:

- Quest is not found in the data
- Name of the servant changed (see below)
- Servant just released on NA
- Quest just released on NA
- Release Time was overridden and is now different
- The quest that is required as unlock condition updated (done in second pass, shouldn't snowball)

## Servant Names

Other than Servants releasing on NA there is another way for the Servant's name to change: The Servant descriptor checks the niceServant export for any other servants with the exact same name (such as _#94 Astolfo_ and _#270 Astolfo)_ and if it found a different Servant with the same name it will append the className in parenthesis to the `name` prop (but not the `search` prop value!).

## search Properties

`search` properties for Servant and Quest names are made with `latinize` using the shared options found in `./scripts/upgrades/constants.mjs`.