import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { useSolidApis } from './useSolidApis';

describe('useSolidApis', () => {
  it('re-creates new profile api after login', () => {
    let onLoginCallback: () => void;
    const session = {
      info: {
        webId: 'https://pod.test/alice#me',
      },
      onLogin: (callback: () => void) => (onLoginCallback = callback),
    } as unknown as Session;

    const render = renderHook(() => useSolidApis(session));

    const profileAPi = render.result.current.profileApi;
    expect(profileAPi).toBeDefined();

    act(() => {
      onLoginCallback();
    });
    expect(render.result.current.profileApi).not.toBe(profileAPi);
  });
  it('re-creates new storage api after login', () => {
    let onLoginCallback: () => void;
    const session = {
      info: {
        webId: 'https://pod.test/alice#me',
      },
      onLogin: (callback: () => void) => (onLoginCallback = callback),
    } as unknown as Session;

    const render = renderHook(() => useSolidApis(session));

    const storageApi = render.result.current.storageApi;
    expect(storageApi).toBeDefined();

    act(() => {
      onLoginCallback();
    });
    expect(render.result.current.storageApi).not.toBe(storageApi);
  });
});
