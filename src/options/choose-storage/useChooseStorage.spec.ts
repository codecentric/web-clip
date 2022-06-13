import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useStorageApi } from '../../api/ApiContext';
import { StorageApi } from '../../api/StorageApi';
import { Storage } from '../../domain/Storage';
import { useChooseStorage } from './useChooseStorage';

jest.mock('../auth/AuthenticationContext');
jest.mock('../../api/ApiContext');

describe('useChooseStorage', () => {
  let renderResult: RenderResult<ReturnType<typeof useChooseStorage>>;
  beforeEach(async () => {
    when(useStorageApi).mockReturnValue({
      findStorage: jest
        .fn()
        .mockResolvedValue(new Storage('https://pod.test/alice/')),
    } as unknown as StorageApi);

    const { result, waitForNextUpdate } = renderHook(() => useChooseStorage());
    renderResult = result;
    await waitForNextUpdate();
  });
  it('returns loading initially', () => {
    expect(renderResult.current.loading).toBe(true);
  });

  it('returns a proposal for the container url based on found storage', () => {
    expect(renderResult.current.containerUrl).toBe(
      'https://pod.test/alice/webclip/'
    );
  });
});
