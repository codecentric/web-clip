import { act } from '@testing-library/react';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useStorageApi } from '../../api/ApiContext';
import { StorageApi } from '../../api/StorageApi';
import { Storage } from '../../domain/Storage';
import { useOptions } from '../OptionsContext';
import { ActionType, Dispatch } from '../reducer';
import { initialState } from '../useOptionsPage';
import { useChooseStorage } from './useChooseStorage';

jest.mock('../auth/AuthenticationContext');
jest.mock('../../api/ApiContext');
jest.mock('../OptionsContext');

describe('useChooseStorage', () => {
  let renderResult: RenderResult<ReturnType<typeof useChooseStorage>>;
  let dispatch: Dispatch;
  let storageApi: StorageApi;

  describe('when a storage can be found', () => {
    beforeEach(async () => {
      dispatch = jest.fn();
      when(useOptions).mockReturnValue({
        state: { ...initialState },
        dispatch,
      });
      storageApi = {
        findStorage: jest
          .fn()
          .mockResolvedValue(new Storage('https://pod.test/alice/')),
        ensureValidContainer: jest.fn(),
      } as unknown as StorageApi;
      when(useStorageApi).mockReturnValue(storageApi);

      const { result, waitForNextUpdate } = renderHook(() =>
        useChooseStorage()
      );
      renderResult = result;
      await waitForNextUpdate();
    });
    it('indicates loading initially', () => {
      expect(renderResult.all[0]).toMatchObject({ loading: true });
    });

    it('indicates no current submission', () => {
      expect(renderResult.current).toMatchObject({ submitting: false });
    });

    it('returns empty container url initially', () => {
      expect(renderResult.all[0]).toMatchObject({ containerUrl: '' });
    });

    it('stops loading indication eventually', () => {
      expect(renderResult.current.loading).toBe(false);
    });

    it('indicates no manual changes', () => {
      expect(renderResult.current.manualChanges).toBe(false);
    });

    it('returns a proposal for the container url based on found storage', () => {
      expect(renderResult.current.containerUrl).toBe(
        'https://pod.test/alice/webclip/'
      );
    });

    it('renders only twice', () => {
      expect(renderResult.all).toHaveLength(2);
    });

    describe('change container url', () => {
      it('updates the value', () => {
        act(() => {
          renderResult.current.setContainerUrl('http://new.url.test/');
        });
        expect(renderResult.current.containerUrl).toBe('http://new.url.test/');
      });

      it('indicates manual changes', () => {
        act(() => {
          renderResult.current.setContainerUrl('http://new.url.test/');
        });
        expect(renderResult.current.manualChanges).toBe(true);
      });
    });

    describe('submit successfully', () => {
      beforeEach(async () => {
        when(storageApi.ensureValidContainer)
          .calledWith('https://pod.test/alice/webclip/')
          .mockResolvedValue(true);
        await act(async () => {
          await renderResult.current.submit();
        });
      });
      it('indicates submission', () => {
        expect(renderResult.all[2]).toMatchObject({ submitting: true });
      });
      it('finishes indication of submission', () => {
        expect(renderResult.current).toMatchObject({ submitting: false });
      });
      it('dispatches STORAGE_SELECTED action', () => {
        expect(dispatch).toHaveBeenLastCalledWith({
          type: ActionType.SELECTED_STORAGE_CONTAINER,
          payload: 'https://pod.test/alice/webclip/',
        });
      });
    });

    describe('submit invalid container url', () => {
      beforeEach(async () => {
        when(storageApi.ensureValidContainer)
          .calledWith('https://pod.test/alice/webclip/')
          .mockResolvedValue(false);
        await act(async () => {
          await renderResult.current.submit();
        });
      });
      it('indicates submission', () => {
        expect(renderResult.all[2]).toMatchObject({ submitting: true });
      });
      it('finishes indication of submission', () => {
        expect(renderResult.current).toMatchObject({ submitting: false });
      });
      it('dispatches nothing', () => {
        expect(dispatch).not.toHaveBeenCalled();
      });

      it('shows a validation error', () => {
        expect(renderResult.current.validationError).toEqual(
          new Error(
            'Please provide the URL of an existing, accessible container'
          )
        );
      });

      it('clears validation error when value changed', () => {
        act(() => {
          renderResult.current.setContainerUrl('http://new.url.test/');
        });
        expect(renderResult.current.validationError).toBe(null);
      });
    });
  });

  describe('when no storage can be found', () => {
    beforeEach(async () => {
      when(useStorageApi).mockReturnValue({
        findStorage: jest.fn().mockResolvedValue(null),
      } as unknown as StorageApi);

      const { result, waitForNextUpdate } = renderHook(() =>
        useChooseStorage()
      );
      renderResult = result;
      await waitForNextUpdate();
    });

    it('stops loading indication eventually', () => {
      expect(renderResult.current.loading).toBe(false);
    });

    it('returns no proposal for the container url', () => {
      expect(renderResult.current.containerUrl).toBe(null);
    });

    it('indicates manual changes', () => {
      expect(renderResult.current.manualChanges).toBe(true);
    });
  });
});
