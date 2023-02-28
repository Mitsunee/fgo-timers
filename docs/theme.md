# Themeing and Responsive Design

This project uses PostCSS with only few extensions to the CSS Spec. Nesting is supported through postcss-preset-env. CSS Custom Properties are used for themeing colors and fonts.

## Colors

### Text

Text mainly uses `--primary` with `--hover` available as an accent color.

### UI

For UI design purposes there are 2 transparent colors available: `--dark` for shadows (and some backgrounds) and `--light` for highlights.

**Note**: Users may have activated a system setting to tell applications that they prefer reduced transparency. This will turn `--dark` and `--light` into opaque colors.

### Backgrounds

In addition to `--dark` there are 3 background colors: `--bg-dark`, `--bg-primary` and `--bg-light`.

**Note:** Currently `--bg-dark` should be used with caution as it has high contrast in some themes.

## Fonts

All elements should use `--sans` as their font-family unless `--title` is appropriate for the element.

## Media Queries

Nested media queries are supported. Please use any of the following custom media queries as breakpoints:

- ` --mq-only-small`: Screens below the smallest breakpoint
- `--mq-small`: Larger phone screens that can support multi-columns for smaller elements
- `--mq-medium`: Tablet Screens and smaller Desktops
- `--mq-large`: Desktops
- `--mq-x-large`: Larger Desktops

Unless media queries are used all elements should display correctly at even tiny screen sizes. The desktop navigation is displayed for devices meeting the `--mq-large` query, otherwise a hamburger button is displayed in the header.

## References

- [app.css](../src/styles/app.css) contains global styles and custom properties
- [media.css](../src/styles/media.css) contains the custom media query breakpoints
