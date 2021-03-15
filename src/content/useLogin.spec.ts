import { act, renderHook } from '@testing-library/react-hooks';
import { mockSolidApi } from '../test/solidApiMock';
import { useLogin } from './useLogin';

describe('useLogin', () => {
  it('calls solid login on login', () => {
    const solidApi = mockSolidApi();
    const { result } = renderHook(() => useLogin());
    result.current.login();
    expect(solidApi.login).toHaveBeenCalled();
  });
  it('returns error, when login failed', async () => {
    const solidApi = mockSolidApi();
    solidApi.login.mockRejectedValue(new Error('oops'));
    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(result.all[1]).toMatchObject({
      error: 'oops',
    });
  });
});
