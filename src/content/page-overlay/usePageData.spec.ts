import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../../domain/messages';

import { sendMessage } from '../../chrome/sendMessage';
import { usePageData } from './usePageData';

jest.mock('../../chrome/sendMessage');

describe('usePageData', () => {
  it('is loading initially', () => {
    const { result } = renderHook(() => usePageData('https://page.example'));
    expect(result.all[0]).toMatchObject({
      loading: true,
    });
  });

  it('sends message to data from page', async () => {
    when(sendMessage)
      .calledWith({
        type: MessageType.IMPORT_PAGE_DATA,
        payload: {
          url: 'https://page.example',
        },
      })
      .mockResolvedValue(undefined);
    const { waitForNextUpdate } = renderHook(() =>
      usePageData('https://page.example')
    );
    await waitForNextUpdate();
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
