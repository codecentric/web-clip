import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PageContent } from './PageContent';
import { useSolid } from './useSolid';

jest.mock('./useSolid');

describe('PageContent', () => {
  beforeEach(() => {
    (useSolid as jest.Mock).mockReturnValue({
      store: null,
      solidApi: null,
    });
  });
  describe('close icon', () => {
    it('is present', () => {
      render(
        <PageContent
          sessionInfo={{ isLoggedIn: false } as ISessionInfo}
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
          sessionInfo={{ isLoggedIn: false } as ISessionInfo}
          close={close}
        />
      );
      const closeButton = screen.queryByLabelText('Close');

      closeButton.click();

      expect(close).toHaveBeenCalled();
    })
  });
});
