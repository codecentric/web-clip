import { getContainerUrl } from './getContainerUrl';

describe('getContainerUrl', () => {
  it('returns the url of the container containing the WebID profile', () => {
    const result = getContainerUrl(
      'https://provider.test/alice/profile/card#me'
    );
    expect(result).toEqual('https://provider.test/alice/profile/');
  });

  it('returns the url of the parent container', () => {
    const result = getContainerUrl('https://provider.test/alice/profile/');
    expect(result).toEqual('https://provider.test/alice/');
  });

  it('returns the root container', () => {
    const result = getContainerUrl('https://provider.test/alice/');
    expect(result).toEqual('https://provider.test/');
  });

  it('returns null if no further parent exists', () => {
    const result = getContainerUrl('https://provider.test/');
    expect(result).toEqual(null);
  });
});
