import { renderHook } from '@testing-library/react-hooks';
import { useStore } from '../store/context';
import { useLegacyPageData } from './useLegacyPageData';

jest.mock('../store/context');

describe('useLegacyPageData', () => {
  it('is loading initially', () => {
    const { result } = renderHook(() =>
      useLegacyPageData('https://page.example')
    );
    expect(result.all[0]).toMatchObject({
      loading: true,
    });
  });

  it('imports data from page', () => {
    const store = {
      importFromUrl: jest.fn(),
    };
    (useStore as jest.Mock).mockReturnValue(store);
    renderHook(() => useLegacyPageData('https://page.example'));
    expect(store.importFromUrl).toHaveBeenCalledWith('https://page.example');
  });

  it('finished loading after import is done', async () => {
    const store = {
      importFromUrl: jest.fn().mockResolvedValue(null),
    };
    (useStore as jest.Mock).mockReturnValue(store);
    const { result, waitForNextUpdate } = renderHook(() =>
      useLegacyPageData('https://page.example')
    );
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      loading: false,
    });
    expect(result.all.length).toBe(2);
  });
});
