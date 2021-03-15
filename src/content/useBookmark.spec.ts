import { act, renderHook } from '@testing-library/react-hooks';
import { mockSolidApi } from '../test/solidApiMock';
import { useBookmark } from './useBookmark';
import { PageMetaData } from './usePage';

describe('useBookmark', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns loading false initially', () => {
    const { result } = renderHook(() => useBookmark());
    expect(result.all[0]).toMatchObject({
      loading: false,
    });
    expect(result.all).toHaveLength(1);
  });

  it('returns loading true while bookmarking', async () => {
    mockSolidApi();
    const { result } = renderHook(() => useBookmark());
    await act(async () => {
      await result.current.addBookmark({
        name: 'any',
        url: 'any',
        type: 'WebPage',
      });
    });
    expect(result.all[1]).toMatchObject({
      loading: true,
    });
    expect(result.all).toHaveLength(3);
  });

  it('calls solid api to create a bookmark', async () => {
    const solidApi = mockSolidApi();
    const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };
    const { result } = renderHook(() => useBookmark());
    await act(async () => {
      await result.current.addBookmark(page);
    });
    expect(solidApi.bookmark).toHaveBeenCalledWith(page);
  });

  it('stops loading indicator after successful bookmarking', async () => {
    mockSolidApi();
    const { result } = renderHook(() => useBookmark());
    await act(async () => {
      await result.current.addBookmark({
        name: 'any',
        url: 'any',
        type: 'WebPage',
      });
    });
    expect(result.all[2]).toMatchObject({
      loading: false,
    });
    expect(result.all).toHaveLength(3);
  });
});
