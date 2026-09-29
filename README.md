# MOSS

Landing page for an indoor plant shop. Built for the RS School
[Landing Page](https://github.com/rolling-scopes-school/tasks/tree/master/fullstack-engineering/tasks/landing-page) task.

## Stack

- Vite
- Sass (SCSS, BEM-style class names)
- Vanilla JavaScript (ES modules)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:3000/rsschool-landing-page/`.

## Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the development server     |
| `npm run build`        | Build the production bundle      |
| `npm run preview`      | Preview the production build     |
| `npm run format`       | Format the project with Prettier |
| `npm run format:check` | Check formatting                 |

## Project structure

```
public/
  data/plants.json      Plant catalog data
  images/               Plant and page images
src/
  js/
    components/         DOM builders for cards and modal
    modules/            Feature modules (catalog, modal, cart, slider, theme, ...)
    utils/              Shared helpers
  styles/
    abstracts/          Variables and breakpoints
    base/               Reset, typography, base rules
    layout/             Header, footer, container
    components/         Reusable UI blocks
    sections/           Page sections
index.html              Home page
catalog.html            Catalog page
journal.html            Journal placeholder
```
