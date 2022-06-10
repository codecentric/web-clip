import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { useSolidApis } from './useSolidApis';

describe('useSolidApis', () => {
  it('re-creates new profile api after login', () => {
    let onLoginCallback: () => void;
    const session = {
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
});
