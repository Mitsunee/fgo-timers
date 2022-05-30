# Gacha Rotation Scraping

Copying of data from gacha banner rotation tables can be somewhat automated with the following steps:

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
tableContent.map(([date, text]) => ({
  /* object content here */
}));
```

### Transforming Durations to Dates

```js
{
  date: `${date.substring(0, date.indexOf(" -"))} ${date.slice(-3)}`;
}
```

### Full Example

In this example there is `1` title row in the table and the list of Servant names uses line breaks as a delimiter

```js
console.log(
  JSON.stringify(
    tableContent.slice(1).map(([date, text]) => ({
      title: text.split("\n").join(" & "),
      date: `${date.substring(0, date.indexOf(" -"))} ${date.slice(-3)}`
    })),
    null,
    2
  )
);
```

The next example has `2` title rows in the table and also a middle column using rowspan for the non-rotating servants. `||` is used to get the 3rd column and 2nd column (in the HTML) as fallback.

```js
console.log(
  JSON.stringify(
    tableContent.slice(2).map(([date, text, text2]) => ({
      title: (text2 || text).split("\n").join(" & "),
      date: `${date.substring(0, date.indexOf(" -"))} ${date.slice(-3)}`
    })),
    null,
    2
  )
);
```

## Editing in Code Editor

Remove any brackets and quotation marks where possible. Add a `-` infront of the title keys and shorten their value as needed.

```yml
- title: Rateup
  times:
    - title: Both SSRs & Both SRs
      date: 2022-05-01 21:00 PDT
    - title: Osakabehime & Both SRs
      date: 2022-05-03 21:00 PDT
    - title: Jinako & Both SRs
      date: 2022-05-05 21:00 PDT
    - title: Both SSRs & Both SRs
      date: 2022-05-07 21:00 PDT
    - title: Osakabehime & Thomas Edison
      date: 2022-05-09 21:00 PDT
    - title: Osakabehime & Nursery Rhyme
      date: 2022-05-10 21:00 PDT
    - title: Jinako & Thomas Edison
      date: 2022-05-11 21:00 PDT
    - title: Jinako & Nursery Rhyme
      date: 2022-05-12 21:00 PDT
    - title: Both SSRs & Both SRs
      date: 2022-05-13 21:00 PDT
```
