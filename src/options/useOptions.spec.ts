import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { useOptions } from './useOptions';
import { save as saveOptions, load as loadOptions } from './optionsStorageApi';

jest.mock('./optionsStorageApi');

describe('useOptions', () => {
  let renderResult: RenderResult<any>;

  beforeEach(async () => {
    (saveOptions as jest.Mock).mockResolvedValue(undefined);
    (loadOptions as jest.Mock).mockResolvedValue({
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
      (loadOptions as jest.Mock).mockResolvedValue({
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
      (saveOptions as jest.Mock).mockResolvedValue(null);
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
