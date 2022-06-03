type ExtensionUrlString = `chrome-extension://${string}/`;
export type ExtensionOrigin = `chrome-extension://${string}`;

export class ExtensionUrl {
  constructor(private url: ExtensionUrlString) {}

  get origin(): ExtensionOrigin {
    return this.url.slice(0, -1) as ExtensionOrigin;
  }

  toString() {
    return this.url;
  }
}

export function getExtensionUrl(): ExtensionUrl {
  return new ExtensionUrl(chrome.extension.getURL('/') as ExtensionUrlString);
}
