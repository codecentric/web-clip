import { renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import { act } from 'react-dom/test-utils';
import { MessageType } from '../messages';
import { useChromeMessageListener } from './chromeMessageListenerContext';
import { useSessionInfo } from './useSessionInfo';

jest.mock('./chromeMessageListenerContext');

describe('useSessionInfo', () => {
  let chromeMessageListener: EventEmitter;

  beforeEach(() => {
    chromeMessageListener = new EventEmitter();

    (useChromeMessageListener as jest.Mock).mockReturnValue(
      chromeMessageListener
    );
  });

  it('returns the initial session info by default', () => {
    const { result } = renderHook(() =>
      useSessionInfo({
        sessionId: 'SESSION_ID',
        isLoggedIn: false,
      })
    );

    expect(result.current).toEqual({
      sessionId: 'SESSION_ID',
      isLoggedIn: false,
    });
  });

  it('updates the session info upon receipt of a chrome LOGGED_IN message', () => {
    const { result } = renderHook(() =>
      useSessionInfo({
        sessionId: 'SESSION_ID',
        isLoggedIn: false,
      })
    );

    const newSessionInfo = {
      sessionId: 'NEW_SESSION_ID',
      isLoggedIn: true,
      webId: 'WEB_ID',
    };
    act(() => {
      chromeMessageListener.emit(MessageType.LOGGED_IN, newSessionInfo);
    });

    expect(result.current).toEqual(newSessionInfo);
  });
});
