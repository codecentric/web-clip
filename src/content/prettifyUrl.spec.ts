import { prettifyUrl } from './prettifyUrl';

describe('prettify url', () => {
  it('strips https:// from url', () => {
    const result = prettifyUrl('https://pod.provider');
    expect(result).toEqual('pod.provider');
  });

  it('strips http:// from url', () => {
    const result = prettifyUrl('http://pod.provider');
    expect(result).toEqual('pod.provider');
  });

  it('removes trailing slash', () => {
    const result = prettifyUrl('http://pod.provider/');
    expect(result).toEqual('pod.provider');
  });

  it('returns empty string for non-urls', () => {
    const result = prettifyUrl('invalid url');
    expect(result).toEqual('');
  });
});
