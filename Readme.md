# WebClip

A Chrome extension to extract structured data from any web page and store it to a Solid Pod.

## Start locally

First install all dependencies by running

```shell
npm install
```

### Content page via Webpack dev server

To run an example page with the plugins content page run

```shell
npm run dev
```

You can use the WebClip popup on the example page with a login on solidcommunity.net. The Options page and the browser integration can not be tested this way, see below how to start the full plugin locally.

### Full extension via chrome

To start webpack in watch mode run

```shell
npm start
```

In Chrome:

1. visit chrome://extensions/ 
2. enable the developer mode
3. Load unpacked extension (choose the project's build folder) 