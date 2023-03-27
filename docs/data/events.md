# Event Files

Event pages are automatically generated from any `.yml` file `./assets/data/events/`.

## See also:

- [Time Formats](./time-formats.md)
- [YAML multiline](https://yaml-multiline.info/) (used for description)
- [Event Schema](../../src/schema/EventSchema.ts)

## Required Properties

The following properties should always be present:

```yml
title: # The full title of the Event
shortTitle: # Shorter version of the title used in EventCard
banner: # filename of the banner in ./public/assets/events/
# You can use "0000_placeholder_banner.png" if there is no corresponding banner image for the event
url: # absolute path of the official News post without leading slash
date: # Date or Duration of the event
description: # string describing the event in one or more short paragraphs
```

## Optional Properties

The following properties can be added for additional information:

### Access Requirement

Information on what is required to access an Event

```yml
requires: # string describing requirment such as "Clear Fuyuki"
```

### Times

Array of further times to display on the events separate page:

- Date or Duration

```yml
times: # Array
  - title: # string
    date: # Date or Duration
    servants: # optional Array of IDs of related Servants
    ces: # optional Array of IDs of related CEs
    items: # optional Array of IDs of related Items
```

Note: For Leyline Stones please use item ID `94054401`. This makes sure an ID that is known on NA is used. There is no benefit for using the correct ID as items are merely displayed and not linked to.

### Schedules

Most commonly used for Event Story release timelocks or Hunting Quest schedules.

```yml
schedules: # Array
  - title: # string
    times: # Array
      - title: # title of sub-time
        date: # Date
        servants: # optional Array of IDs of related Servants
        ces: # optional Array of IDs of related CEs
        items: # optional Array of IDs of related Items
    ends: # optional end date (if different from event end time),
    icon: # optional path to icon
```

### Summoning Banners

Please append comments after `servants` for clarity. If given the first Servant will be used as the icon in the Card.

```yml
banners:
  - date: # Duration
    servants: # optional Array of Servant IDs
    ces: # optinal Array of CE IDs
    priority: # optional sorting priority, higher number appears first
```

### Upgrades

Please append comments after IDs for clarity. Dates should be added to [openTimeOverrides.yml](../../assets/data/upgrades/openTimeOverrides.yml) when possible.

```yml
upgrades: # Array of servant IDs
```
