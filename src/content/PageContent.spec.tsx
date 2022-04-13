import React from 'react';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { render, screen } from '@testing-library/react';
import { PageContent } from './PageContent';
import { useSessionInfo } from './useSessionInfo';

jest.mock('./useSessionInfo');

describe('PageContent', () => {
  beforeEach(() => {
    (useSessionInfo as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });
  });
  describe('without provider url', () => {
    it('shows setup button', () => {
      render(
        <PageContent
          sessionInfo={{ isLoggedIn: false } as ISessionInfo}
          providerUrl={null}
          close={() => null}
        />
      );
      const setupButton = screen.queryByText('Get started');
      expect(setupButton).toBeInTheDocument();
    });
  });
  describe('when not logged in', () => {
    it('shows login button', () => {
      render(
        <PageContent
          sessionInfo={{ isLoggedIn: false } as ISessionInfo}
          providerUrl="https://provider.test"
          close={() => null}
        />
      );
      const loginButton = screen.queryByText('Login');
      expect(loginButton).toBeInTheDocument();
    });
  });
  describe('close icon', () => {
    it('is present', () => {
      render(
        <PageContent
          sessionInfo={{ isLoggedIn: false } as ISessionInfo}
          providerUrl="https://provider.test"
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
          providerUrl="https://provider.test"
          close={close}
        />
      );
      const closeButton = screen.queryByLabelText('Close');

      closeButton.click();

      expect(close).toHaveBeenCalled();
    });
  });
});
