# Events

Event pages are automatically generated from any `.yml` file `./assets/data/events/`.

## Time Formats

### Dates

Dates are strings containing a date in the following format: `YYYY-mm-dd HH:mm (PST|PDT)` for example `2021-11-17 18:00 PST`. This string is converted to a unix timestamp with milliseconds during SSG.

### Durations

Much like Dates (see above) Durations are strings that hold time information. Durations contain a start and end time in the following format:  
`YYYY-mm-dd HH:mm (PST|PDT)? - (YYYY-)?mm-dd HH:mm (PST|PDT)` (the timezone of the start date and year of the end date can be left out).

This format matches the format used by DW in News posts.  
Example: `2021-11-16 00:00 - 11-22 19:59 PST`

## Required Properties

The following properties should always be present:

```yml
title: # The full title of the Event
shortTitle: # Shorter version of the title used in EventCard
banner: # filename of the banner in ./public/assets/events/
# You can use "placeholder_banner.png" if there is no corresponding banner image for the event
date: # Date or Duration of the event
```

## Optional Properties

The following properties can be added for additional information:

### url

Contains the absolute path of the official News post without the leading slash.

Example: `2021/1116_interlude11/`

### hideWhenDone

Boolean value that if set true removes the event from the HomePage after the set date.

If given a Date the event will be hidden at and after the set time.  
If given a Duration the event will be hidden at and after the end time.

Default: `false`

### displayOrder

Numerical value used as bias when sorting events with the same (start) time. Lower displayOrder's will be displayed first.

Default: `0`

### times

Array of further times to display on the events separate page. These times can take two formats (can be mixed and matched as needed):

- Date or Duration

```yml
times: # Array
  - title: # string
    date: # Date or Duration
    hideWhenDone: # boolean, optional, Default: false
```

- Rotating Time

Displays as many sub-times as possible that have not expired yet. Most commonly used for Event Story release timelocks or Hunting Quest schedules.

```yml
times: # Array
  - title: # string, optional, Default: Start
    hideWhenDone: # boolean, optional, Default: false
    times: # Array
      - title: # title of sub-time
        date: # Date, start time of sub-time
```

### description

Text description for Event. See [yaml-multiline.info](https://yaml-multiline.info/) for information on block scalars in yaml. Will get split into an array based on line-breaks and mapped into `<p>` elements in client.
