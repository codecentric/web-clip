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

### Limited development mode via Webpack dev server

To run a pure web application version of the extension execute

```shell
npm run dev
```

Be aware that this mode mocks the chrome API and not everything will work the
same way as the real extension would. So make sure to always
[test the full extension via chrome](#full-extension-via-chrome).

You can use the WebClip popup [on the example page](http://localhost:8080) with
a login to [the local development pod](#local-pod-for-testing).

The option page can also be opened via the icon in the UI, or directly visited
at http://localhost:8080/options.html.

Some features, like granting access to a remote pod, can not be tested that way,
but the limited dev mode is a good way to test simple UI-focused changes,
without having to rebuild and reload the whole plugin.

To test the real extension, integrated with the browser API, see section
["Full extension via chrome"](#full-extension-via-chrome).

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
