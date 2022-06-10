import React from 'react';
import { render, screen } from '@testing-library/react';
import { when } from 'jest-when';
import { ExtensionUrl } from '../../chrome/urls';
import { ProfileApi } from '../../api/ProfileApi';
import { AuthorizationSection } from './AuthorizationSection';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

jest.mock('./useCheckAccessPermissions');

describe('AuthorizationSection', () => {
  describe('while checking access permissions', () => {
    beforeEach(() => {
      const profileApi = {
        getProfileDocUrl: () => 'https://pod.example/alice',
      } as unknown as ProfileApi;
      when(useCheckAccessPermissions)
        .calledWith(
          new ExtensionUrl('chrome-extension://extension-id/'),
          new URL('https://extension-id.chromiumapp.org'),
          profileApi
        )
        .mockReturnValue({
          checking: true,
        });

      render(
        <AuthorizationSection
          extensionUrl={new ExtensionUrl('chrome-extension://extension-id/')}
          redirectUrl={new URL('https://extension-id.chromiumapp.org')}
          profileApi={profileApi}
        />
      );
    });

    it('indicates that check is in progress', () => {
      expect(
        screen.queryByText('Checking access permissions')
      ).toBeInTheDocument();
    });

    it('displays the extension url', () => {
      expect(
        screen.queryByText('chrome-extension://extension-id')
      ).toBeInTheDocument();
    });
  });

  describe('after checking access permission', () => {
    beforeEach(() => {
      const profileApi = {
        getProfileDocUrl: () => 'https://pod.example/alice',
      } as unknown as ProfileApi;
      when(useCheckAccessPermissions)
        .calledWith(
          new ExtensionUrl('chrome-extension://extension-id/'),
          new URL('https://extension-id.chromiumapp.org'),
          profileApi
        )
        .mockReturnValue({
          checking: false,
        });

      render(
        <AuthorizationSection
          extensionUrl={new ExtensionUrl('chrome-extension://extension-id/')}
          redirectUrl={new URL('https://extension-id.chromiumapp.org')}
          profileApi={profileApi}
        />
      );
    });

    it('indicates that access needs to be granted', () => {
      expect(
        screen.queryByText('You need to grant access.')
      ).toBeInTheDocument();
    });

    it('has a link to grant access', () => {
      const grantAccessLink = screen
        .queryAllByRole('link')
        .find((it) => it.textContent === 'Grant access');
      expect(grantAccessLink).toBeInTheDocument();
      expect(grantAccessLink.getAttribute('href')).toBe(
        `https://pod.example/alice/.web-clip/${chrome.runtime.id}`
      );
    });

    it('displays the extension url', () => {
      expect(
        screen.queryByText('chrome-extension://extension-id')
      ).toBeInTheDocument();
    });
  });
});
