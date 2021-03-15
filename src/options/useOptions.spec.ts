import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { useOptions } from './useOptions';
import { useOptionsStorage } from './useOptionsStorage';

jest.mock('./useOptionsStorage');

describe('useOptions', () => {
  describe('on mount', () => {
    let renderResult: RenderResult<any>;
    beforeEach(async () => {
      const loadOptions = jest.fn();
      (useOptionsStorage as jest.Mock).mockReturnValue({
        save: jest.fn(),
        load: loadOptions,
      });
      loadOptions.mockResolvedValue({
        providerUrl: 'https://pod.provider.example',
      });
      const render = renderHook(() => useOptions());
      renderResult = render.result;

      await render.waitForNextUpdate();
    });

    it('indicates loading', async () => {
      expect(renderResult.all[0]).toMatchObject({
        loading: true,
      });
    });

    it('returns loaded options', async () => {
      expect(renderResult.all[1]).toMatchObject({
        loading: false,
        providerUrl: 'https://pod.provider.example',
      });
    });
  });

  describe('change provider url', () => {
    it('updates the value', async () => {
      const loadOptions = jest.fn();
      (useOptionsStorage as jest.Mock).mockReturnValue({
        save: jest.fn(),
        load: loadOptions,
      });
      loadOptions.mockResolvedValue({
        providerUrl: 'https://pod.provider.example',
      });
      const { result, waitForNextUpdate } = renderHook(() => useOptions());

      await waitForNextUpdate();

      act(() => {
        result.current.setProviderUrl('https://new.provider.example');
      });

      expect(result.current.providerUrl).toBe('https://new.provider.example');
    });
  });
});
