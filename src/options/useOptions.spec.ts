import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { useOptions } from './useOptions';
import { useOptionsStorage } from './useOptionsStorage';

jest.mock('./useOptionsStorage');

describe('useOptions', () => {
  let renderResult: RenderResult<any>;
  let loadOptions: jest.Mock;
  let saveOptions: jest.Mock;

  beforeEach(async () => {
    loadOptions = jest.fn();
    saveOptions = jest.fn();
    (useOptionsStorage as jest.Mock).mockReturnValue({
      save: saveOptions,
      load: loadOptions,
    });
    loadOptions.mockResolvedValue({
      providerUrl: 'https://pod.provider.example',
    });
    const render = renderHook(() => useOptions());
    renderResult = render.result;

    await render.waitForNextUpdate();
  });

  describe('on mount', () => {
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

  describe('saving the provider url', () => {
    it('saves the url and returns a confirmation', async () => {
      saveOptions.mockResolvedValue(null);
      const { result, waitForNextUpdate } = renderHook(() => useOptions());

      act(() => {
        result.current.setProviderUrl('https://new.provider.example');
      });

      act(() => {
        result.current.save();
      });

      await waitForNextUpdate();

      expect(saveOptions).toHaveBeenCalledWith({
        providerUrl: 'https://new.provider.example',
      });
      expect(result.current.saved).toBe(true);
    });
  });
});
