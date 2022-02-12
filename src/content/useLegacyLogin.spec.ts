import { act, renderHook } from '@testing-library/react-hooks';
import { mockSolidApi } from '../test/solidApiMock';
import { useLegacyLogin } from './useLegacyLogin';

describe('useLogin', () => {
  it('calls solid login on login', () => {
    const solidApi = mockSolidApi();
    const { result } = renderHook(() => useLegacyLogin());
    result.current.login();
    expect(solidApi.login).toHaveBeenCalled();
  });
  it('returns error, when login failed', async () => {
    const solidApi = mockSolidApi();
    solidApi.login.mockRejectedValue(new Error('oops'));
    const { result } = renderHook(() => useLegacyLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(result.all[1]).toMatchObject({
      error: 'oops',
    });
  });
});
