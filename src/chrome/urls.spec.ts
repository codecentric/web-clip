import { ExtensionUrl } from './urls';

describe('ExtensionUrl', () => {
  it('toString returns plain string value', () => {
    const url = new ExtensionUrl('chrome-extension://extension-id/');
    expect(url.toString()).toEqual('chrome-extension://extension-id/');
  });

  it('origin returns url without trailing slash', () => {
    const url = new ExtensionUrl('chrome-extension://extension-id/');
    expect(url.origin).toEqual('chrome-extension://extension-id');
  });
});
