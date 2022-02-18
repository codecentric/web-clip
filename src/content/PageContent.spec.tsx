import { Session } from '@inrupt/solid-client-authn-browser';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PageContent } from './PageContent';
import { useSolid } from './useSolid';
import { useSessionInfo } from './useSessionInfo';

jest.mock('./useSolid');
jest.mock('./useSessionInfo');

describe('PageContent', () => {
  beforeEach(() => {
    (useSessionInfo as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });
    (useSolid as jest.Mock).mockReturnValue({
      store: null,
      solidApi: null,
    });
  });
  describe('close icon', () => {
    it('is present', () => {
      render(
        <PageContent
          legacySession={{ info: { isLoggedIn: false } } as Session}
          close={() => null}
        />
      );
      const closeButton = screen.queryByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });

    it('calls the close callback when clicked', () => {
      const close = jest.fn();
      render(
        <PageContent
          legacySession={{ info: { isLoggedIn: false } } as Session}
          close={close}
        />
      );
      const closeButton = screen.queryByLabelText('Close');

      closeButton.click();

      expect(close).toHaveBeenCalled();
    });
  });
});
