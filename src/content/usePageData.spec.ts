import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../messages';
import { usePageData } from './usePageData';

import { sendMessage } from './sendMessage';

jest.mock('./sendMessage');

describe('usePageData', () => {
  it('is loading initially', () => {
    const { result } = renderHook(() => usePageData('https://page.example'));
    expect(result.all[0]).toMatchObject({
      loading: true,
    });
  });

  it('sends message to data from page', () => {
    when(sendMessage)
      .calledWith({
        type: MessageType.IMPORT_PAGE_DATA,
        payload: {
          url: 'https://page.example',
        },
      })
      .mockResolvedValue(undefined);
    renderHook(() => usePageData('https://page.example'));
    expect(sendMessage).toHaveBeenCalledWith({
      type: MessageType.IMPORT_PAGE_DATA,
      payload: {
        url: 'https://page.example',
      },
    });
  });

  it('finished loading after import is done', async () => {
    when(sendMessage)
      .calledWith({
        type: MessageType.IMPORT_PAGE_DATA,
        payload: {
          url: 'https://page.example',
        },
      })
      .mockResolvedValue(undefined);
    const { result, waitForNextUpdate } = renderHook(() =>
      usePageData('https://page.example')
    );
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      loading: false,
    });
    expect(result.all.length).toBe(2);
  });
});
