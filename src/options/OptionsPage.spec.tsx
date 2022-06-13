import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import { ExtensionUrl } from '../chrome/urls';
import { StorageApi } from '../api/StorageApi';
import { Storage } from '../domain/Storage';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { ProfileApi } from '../api/ProfileApi';
import { useAuthentication } from './auth/AuthenticationContext';
import { OptionsPage } from './OptionsPage';
import { load as loadOptions, save as saveOptions } from './optionsStorageApi';
import { useChromeExtension } from './useChromeExtension';
import { useSolidApis } from '../api/useSolidApis';

jest.mock('./optionsStorageApi');
jest.mock('./auth/AuthenticationContext');
jest.mock('./useChromeExtension');
jest.mock('../api/useSolidApis');

describe('OptionsPage', () => {
  let profileApi: ProfileApi;
  let storageApi: StorageApi;

  beforeEach(() => {
    when(useChromeExtension).mockReturnValue({
      extensionUrl: new ExtensionUrl('chrome-extension://extension-id/'),
      redirectUrl: new URL('https://redirect.test'),
    });
    profileApi = {
      canExtensionAccessPod: jest.fn().mockResolvedValue(false),
      getProfileDocUrl: () => '',
    } as unknown as ProfileApi;
    storageApi = {
      findStorage: jest.fn(),
    } as unknown as StorageApi;
    when(useSolidApis).mockReturnValue({ profileApi, storageApi });
  });

  describe('while loading', () => {
    beforeEach(() => {
      (saveOptions as jest.Mock).mockResolvedValue(undefined);
      (loadOptions as jest.Mock).mockReturnValue(new Promise(() => null));

      render(<OptionsPage session={new Session()} />);
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
        containerUrl: 'https://alice.solidcommunity.net/webclip/',
      });
    });

    it('should allow to input a Solid IDP URI', async () => {
      render(<OptionsPage session={new Session()} />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toBeInTheDocument();
    });

    it('shows solidcommunity.net as default provider URL in the input', async () => {
      render(<OptionsPage session={new Session()} />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toHaveValue('https://solidcommunity.net');
    });

    it('allows to change the provider url', async () => {
      render(<OptionsPage session={new Session()} />);
      const input = await screen.findByLabelText('Pod Provider URL');
      userEvent.clear(input);
      userEvent.type(input, 'https://another.provider.example');

      expect(input).toHaveValue('https://another.provider.example');
    });

    it('should have a Connect Pod button', async () => {
      render(<OptionsPage session={new Session()} />);
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
      render(<OptionsPage session={new Session()} />);
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
        containerUrl: 'https://alice.solidcommunity.net/webclip/',
        trustedApp: false,
      });
    });

    it('checks permission after login', async () => {
      let resolveCheckAccessPromise: (value: boolean) => void = () => null;
      when(profileApi.canExtensionAccessPod).mockReturnValue(
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
      render(<OptionsPage session={new Session()} />);
      const input = await screen.findByLabelText('Pod Provider URL');
      fireEvent.change(input, {
        target: {
          value: 'https://pod.provider.example',
        },
      });
      const button = await screen.findByText('Connect Pod');
      fireEvent.click(button);
      await screen.findByText('Signing in');

      expect(
        await screen.findByText('Checking access permissions')
      ).toBeInTheDocument();

      resolveCheckAccessPromise(true);

      expect(
        await screen.findByText('Everything is set up correctly.')
      ).toBeInTheDocument();
    });

    it('asks for a storage location after checking access', async () => {
      (loadOptions as jest.Mock).mockResolvedValue({
        providerUrl: 'https://solidcommunity.net',
        containerUrl: '',
      });
      when(profileApi.canExtensionAccessPod).mockResolvedValue(true);
      when(storageApi.findStorage).mockResolvedValue(
        new Storage('https://alice.pod.test/private/')
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
      render(<OptionsPage session={new Session()} />);
      const input = await screen.findByLabelText('Pod Provider URL');
      fireEvent.change(input, {
        target: {
          value: 'https://pod.provider.example',
        },
      });
      const button = await screen.findByText('Connect Pod');
      fireEvent.click(button);
      await screen.findByText('Signing in');

      expect(
        await screen.queryByText('Everything is set up correctly.')
      ).not.toBeInTheDocument();

      expect(
        await screen.findByText('Where do you want to store your clips?')
      ).toBeInTheDocument();

      expect(
        await screen.findByDisplayValue(
          'https://alice.pod.test/private/webclip/'
        )
      ).toBeInTheDocument();
    });
  });
});
