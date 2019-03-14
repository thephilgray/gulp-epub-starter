# gulp-epub-starter

A Gulp starter for working on EPUB projects with Babel, Less, and BrowserSync + Readium Cloud Reader for live reloaded previews.

## Installation

```bash
npm i -g degit
degit https://github.com/thephilgray/gulp-epub-starter.git <project-name>
cd <project-name>
npm install
```

## Starting the dev server

```bash
npm run dev
```

- EPUB will launch in a Readium instance in the browser on localhost

## Validating and zipping EPUB

```bash
npm run publish
```

- Check the `./dist` folder for validation output and zipped EPUB
