# News Post Scraping

Copying of data from time tables in official news posts can be somewhat automated with the following steps:

## Inspect tbody

Press Rightclick and Inspect on the table in question, then select the `<tbody>` element. The code snippets in this file reference `<tbody>` as `$0`.

## Arrayify Table Content

Use the following snippet to copy all text in the table into a nested array:

```js
const tableContent = [...$0.children].map(tr =>
  [...tr.children].map(td => td.innerText)
);
```

## Re-arranging data

Wrap any code you write in this to make it easier to copy later:

```js
console.log(JSON.stringify(
  /*your code here*/
,null,2));
```

Generally you want to map the tableContent array like this, using slice to skip the header rows (usually 1 or 2):

```js
tableContent.map(([text, date]) => ({
  // object content here
}));

// or

tableContent.map(([text, date]) => {
  // vars go here
  return {
    // object content here
  };
});
```

### Joining multiline text

```js
([text]) => ({
  title: text.split("\n").join(" & ")
});
```

### Filtering/Cleaning Chapter titles

```js
([text]) => ({
  title: text
    .split("\n")
    .filter(seg => !seg.includes("Free Quest"))
    .join(" & ")
    .replace(/Main Quest /g, "")
});
```

### Extracting Durations

```js
([date]) => ({
  date: date.match(/(\d+-)?\d+-\d+ \d+:\d\d( P[DS]T)?/g).join(" - ")
});
```

### Extracting Dates

```js
([date]) => {
  const matchDate = date.match(/\d+-\d+-\d+ \d+:\d\d/);
  const matchTz = date.match(/ P[DS]T/);
  return {
    // other props here
    date: `${matchDate?.[0]}${matchTz?.[0]}`
  };
};
```

### Fallback for tables with colspan

```js
tableContent.slice(2).map(([date, text, text2]) => ({
      title: (text2 || text).split("\n").join(" & "),
```

## Full Examples

### Extracting Dates and cleaned Chapter titles from a Schedule Table

```js
console.log(
  JSON.stringify(
    tableContent.slice(1).map(([text, date]) => {
      const matchDate = date.match(/\d+-\d+-\d+ \d+:\d\d/);
      const matchTz = date.match(/ P[DS]T/);
      return {
        text: text
          .split("\n")
          .filter(seg => !seg.includes("Free Quest"))
          .join(" & ")
          .replace(/Main Quest /g, ""),
        date: `${matchDate?.[0]}${matchTz?.[0]}`
      };
    }),
    null,
    2
  )
);
```

### Fallback for tables using colspan

```js
console.log(
  JSON.stringify(
    tableContent.slice(2).map(([date, text, text2]) => ({
      title: (text2 || text).split("\n").join(" & "),
      date: date.match(/(\d+-)?\d+-\d+ \d+:\d\d( P[DS]T)?/g).join(" - ")
    })),
    null,
    2
  )
);
```
