import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { Session } from '../../solid-client-authn-chrome-ext/Session';
import { useAuthentication } from '../auth/AuthenticationContext';
import { useLogin } from './useLogin';

jest.mock('../auth/AuthenticationContext');

describe('useLogin', () => {
  let session: Session;
  beforeEach(() => {
    session = {
      login: jest.fn().mockResolvedValue(undefined),
    } as unknown as Session;
    when(useAuthentication).mockReturnValue({
      session,
      redirectUrl: 'https://redirect.test',
    });
  });

  it('returns loading false', () => {
    const { result } = renderHook(() => useLogin('https://pod.test'));
    expect(result.current).toMatchObject({
      loading: false,
    });
  });

  it('calls session login on login', async () => {
    const { result } = renderHook(() => useLogin('https://pod.test'));
    await result.current.login();
    expect(session.login).toHaveBeenCalledWith({
      oidcIssuer: 'https://pod.test',
      redirectUrl: 'https://redirect.test',
    });
  });

  it('indicates loading while logging in', async () => {
    const { result } = renderHook(() => useLogin('https://pod.test'));
    await act(async () => {
      await result.current.login();
    });
    expect(result.all).toHaveLength(3);
    expect(result.all[0]).toMatchObject({
      loading: false,
    });
    expect(result.all[1]).toMatchObject({
      loading: true,
    });
    expect(result.all[2]).toMatchObject({
      loading: false,
    });
  });
});
