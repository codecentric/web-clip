import { Session } from '@inrupt/solid-client-authn-browser';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { useAuthorization } from './useAuthorization';

describe('useAuthorization', () => {
  let session: Session;
  let renderResult: RenderResult<ReturnType<typeof useAuthorization>>;

  describe('when not logged in', () => {
    beforeEach(() => {
      session = {
        info: {
          isLoggedIn: false,
        },
        login: jest.fn().mockResolvedValue(null),
      } as unknown as Session;
      const render = renderHook(() =>
        useAuthorization(session, 'https://pod.test', 'extension-id')
      );
      renderResult = render.result;
    });

    it('is loading initially', () => {
      expect(renderResult.all).toHaveLength(1);
      expect(renderResult.current.loading).toBe(true);
    });

    it('triggers login to provider url', () => {
      expect(session.login).toHaveBeenCalledWith({
        oidcIssuer: 'https://pod.test',
      });
    });
  });

  describe('when already logged in', () => {
    beforeEach(() => {
      session = {
        info: {
          isLoggedIn: true,
        },
        login: jest.fn(),
      } as unknown as Session;
      const render = renderHook(() =>
        useAuthorization(session, 'https://pod.test', 'extension-id')
      );
      renderResult = render.result;
    });

    it('indicates no loading', () => {
      expect(renderResult.current.loading).toBe(false);
    });

    it('does not trigger another login', () => {
      expect(session.login).not.toHaveBeenCalled();
    });
  });
});
