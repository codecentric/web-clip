import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';
import { ProfileApi } from './api/ProfileApi';
import { useAuthentication } from './auth/AuthenticationContext';
import { OptionsPage } from './OptionsPage';
import { load as loadOptions, save as saveOptions } from './optionsStorageApi';

jest.mock('./optionsStorageApi');
jest.mock('./auth/AuthenticationContext');

describe('OptionsPage', () => {
  let profileApi: ProfileApi;

  beforeEach(() => {
    profileApi = {
      hasGrantedAccessTo: jest.fn().mockResolvedValue(false),
    } as unknown as ProfileApi;
  });

  describe('while loading', () => {
    beforeEach(() => {
      (saveOptions as jest.Mock).mockResolvedValue(undefined);
      (loadOptions as jest.Mock).mockReturnValue(new Promise(() => null));

      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
    });
    it('shows a loading indicator', () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    beforeEach(async () => {
      when(useAuthentication).mockReturnValue({
        session: {
          login: (): null => null,
          info: {
            sessionId: 'test-session',
            isLoggedIn: false,
          },
        },
        redirectUrl: '',
      });
      (saveOptions as jest.Mock).mockResolvedValue(undefined);
      (loadOptions as jest.Mock).mockResolvedValue({
        providerUrl: 'https://solidcommunity.net',
      });
    });

    it('should allow to input a Solid IDP URI', async () => {
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toBeInTheDocument();
    });

    it('shows solidcommunity.net as default provider URL in the input', async () => {
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toHaveValue('https://solidcommunity.net');
    });

    it('allows to change the provider url', async () => {
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const input = await screen.findByLabelText('Pod Provider URL');
      userEvent.clear(input);
      userEvent.type(input, 'https://another.provider.example');

      expect(input).toHaveValue('https://another.provider.example');
    });

    it('should have a Connect Pod button', async () => {
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const button = await screen.findByText('Connect Pod');
      expect(button).toBeInTheDocument();
    });

    it('should save the pod provider url and provide a confirmation message', async () => {
      when(useAuthentication).mockReturnValue({
        session: {
          login: (): null => null,
          info: {
            sessionId: 'test-session',
            isLoggedIn: false,
            webId: '',
          },
        },
        redirectUrl: '',
      });
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const input = await screen.findByLabelText('Pod Provider URL');
      fireEvent.change(input, {
        target: {
          value: 'https://pod.provider.example',
        },
      });
      const button = await screen.findByText('Connect Pod');
      fireEvent.click(button);
      await screen.findByText('Signing in');
      expect(await screen.findByText('All settings saved')).toBeInTheDocument();

      expect(saveOptions).toHaveBeenCalledWith({
        providerUrl: 'https://pod.provider.example',
        trustedApp: false,
      });
    });

    it('checks permission after login', async () => {
      let resolveCheckAccessPromise: (value: boolean) => void = () => null;
      when(profileApi.hasGrantedAccessTo).mockReturnValue(
        new Promise<boolean>((resolve) => (resolveCheckAccessPromise = resolve))
      );
      when(useAuthentication).mockReturnValue({
        session: {
          login: (): null => null,
          info: {
            sessionId: 'test-session',
            isLoggedIn: true,
            webId: 'https://pod.test/alice#me',
          },
        },
        redirectUrl: '',
      });
      render(
        <OptionsPage
          profileApi={profileApi}
          redirectUrl=""
          session={null}
          extensionUrl=""
        />
      );
      const input = await screen.findByLabelText('Pod Provider URL');
      fireEvent.change(input, {
        target: {
          value: 'https://pod.provider.example',
        },
      });
      const button = await screen.findByText('Connect Pod');
      fireEvent.click(button);
      await screen.findByText('Signing in');

      // TODO: indicate permission check
      // expect(
      //   await screen.findByText('Checking access permissions')
      // ).toBeInTheDocument();

      resolveCheckAccessPromise(true);

      expect(
        await screen.findByText('Everything is set up correctly.')
      ).toBeInTheDocument();
    });
  });
});
