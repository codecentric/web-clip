import { renderHook } from '@testing-library/react-hooks';
import { useSessionInfo } from './useSessionInfo';
import { Session } from '@inrupt/solid-client-authn-browser';
import { useChromeMessageListener } from './useChromeMessageListener';
import { EventEmitter } from 'events';
import { MessageType } from '../messages';

jest.mock('./useChromeMessageListener');

describe('useSessionInfo', () => {
  let chromeMessageListener: EventEmitter;

  beforeEach(() => {
    chromeMessageListener = new EventEmitter();

    (useChromeMessageListener as jest.Mock).mockReturnValue(
      chromeMessageListener
    );
  });

  it('returns the legacy session info by default', () => {
    const { result } = renderHook(() =>
      useSessionInfo(new Session({}, 'LEGACY_SESSION_ID'))
    );

    expect(result.current.sessionInfo).toEqual({
      sessionId: 'LEGACY_SESSION_ID',
      isLoggedIn: false,
    });
  });

  it('updates the session info upon receipt of a chrome LOGGED_IN message', () => {
    const { result } = renderHook(() =>
      useSessionInfo(new Session({}, 'LEGACY_SESSION_ID'))
    );

    const newSessionInfo = {
      sessionId: 'NEW_SESSION_ID',
      isLoggedIn: true,
      webId: 'WEB_ID',
    };
    chromeMessageListener.emit(MessageType.LOGGED_IN, newSessionInfo);

    expect(result.current.sessionInfo).toEqual(newSessionInfo);
  });
});
