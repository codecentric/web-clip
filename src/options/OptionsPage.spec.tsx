import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { OptionsPage } from './OptionsPage';
import { save as saveOptions, load as loadOptions } from './optionsStorageApi';

jest.mock('./optionsStorageApi');

describe('OptionsPage', () => {
  describe('while loading', () => {
    beforeEach(() => {
      (saveOptions as jest.Mock).mockResolvedValue(undefined);
      (loadOptions as jest.Mock).mockReturnValue(new Promise(() => null));

      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
    });
    it('shows a loading indicator', () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    beforeEach(async () => {
      (saveOptions as jest.Mock).mockResolvedValue(undefined);
      (loadOptions as jest.Mock).mockResolvedValue({
        providerUrl: 'https://solidcommunity.net',
      });
    });

    it('should allow to input a Solid IDP URI', async () => {
      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toBeInTheDocument();
    });

    it('shows solidcommunity.net as default provider URL in the input', async () => {
      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toHaveValue('https://solidcommunity.net');
    });

    it('allows to change the provider url', async () => {
      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
      const input = await screen.findByLabelText('Pod Provider URL');
      userEvent.clear(input);
      userEvent.type(input, 'https://another.provider.example');

      expect(input).toHaveValue('https://another.provider.example');
    });

    it('should have a save button', async () => {
      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
      const button = await screen.findByText('Save');
      expect(button).toBeInTheDocument();
    });

    it('should save the pod provider url and provide a confirmation message', async () => {
      render(<OptionsPage redirectUrl="" session={null} extensionUrl="" />);
      const input = await screen.findByLabelText('Pod Provider URL');
      fireEvent.change(input, {
        target: {
          value: 'https://pod.provider.example',
        },
      });
      const button = await screen.findByText('Save');
      fireEvent.click(button);

      expect(saveOptions).toHaveBeenCalledWith({
        providerUrl: 'https://pod.provider.example',
      });
      expect(
        await screen.findByText('Pod Provider URL saved')
      ).toBeInTheDocument();
    });
  });
});
