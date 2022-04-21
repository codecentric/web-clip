# WebClip

A Chrome extension to extract structured data from any web page and store it to
a Solid Pod.

## Install

You can install the extension easily
[via the Chrome Web Store](https://chrome.google.com/webstore/detail/webclip-clip-all-the-thin/mfgjcggbpdkbnnpgllaicoeplfgkfnkj).

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

You can use the WebClip popup on the example page with a login to the local
development pod (see [below](#local-pod-for-testing)).

The Options page and the browser integration can not be tested this way, see
section ["Full extension via chrome"](#full-extension-via-chrome) how to start
the full plugin locally.

### Local pod for testing

You need [Docker](https://www.docker.com) to do this.

To start a Community Solid Server instance locally for testing run:

```shell
npm run pod:up
```

The server will be running as a docker container in the background and can be
accessed on http://localhost:3000.

The data of it is stored at `./dev/pod`.

| Log in   |                   |
| -------- | ----------------- |
| email    | webclip@mail.test |
| password | webclip-dev-pod   |

To view the server logs run:

```shell
npm run pod:logs
```

To stop the server execute:

```shell
npm run pod:down
```

### Full extension via chrome

To start webpack in watch mode run

```shell
npm start
```

In Chrome:

1. visit chrome://extensions/
2. enable the developer mode
3. Load unpacked extension (choose the project's build folder)

## Release on Chrome Web Store

All commits to the main branch trigger a Github Actions CI/CD build, that
creates or
[updates a draft release](https://github.com/codecentric/web-clip/releases) with
the version from package.json. The ZIP file can then be downloaded locally and
uploaded manually via the
[Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/ee35c951-053f-4723-80b8-e4420a571f64/mfgjcggbpdkbnnpgllaicoeplfgkfnkj/edit/package?hl=de).
To create an official release on GitHub, the `release` step in the
[CI/CD Github Action](https://github.com/codecentric/web-clip/actions/workflows/ci-cd.yml)
needs to be triggered manually.
