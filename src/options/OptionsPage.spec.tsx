import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { OptionsPage } from './OptionsPage';
import { useOptionsStorage } from './useOptionsStorage';

jest.mock('./useOptionsStorage');

describe('OptionsPage', () => {
  describe('while loading', () => {
    beforeEach(() => {
      (useOptionsStorage as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(undefined),
        load: jest.fn().mockReturnValue(new Promise(() => {})),
      });
      render(<OptionsPage />);
    });
    it('shows a loading indicator', () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    let saveOptions: jest.Mock;
    beforeEach(async () => {
      saveOptions = jest.fn().mockResolvedValue(undefined);
      (useOptionsStorage as jest.Mock).mockReturnValue({
        save: saveOptions,
        load: jest.fn().mockResolvedValue({
          providerUrl: 'https://solidcommunity.net',
        }),
      });
    });

    it('should allow to input a Solid IDP URI', async () => {
      render(<OptionsPage />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toBeInTheDocument();
    });

    it('shows solidcommunity.net as default provider URL in the input', async () => {
      render(<OptionsPage />);
      const input = await screen.findByLabelText('Pod Provider URL');
      expect(input).toHaveValue('https://solidcommunity.net');
    });

    it('allows to change the provider url', async () => {
      render(<OptionsPage />);
      const input = await screen.findByLabelText('Pod Provider URL');
      userEvent.clear(input);
      userEvent.type(input, 'https://another.provider.example');

      expect(input).toHaveValue('https://another.provider.example');
    });

    it('should have a save button', async () => {
      render(<OptionsPage />);
      const button = await screen.findByText('Save');
      expect(button).toBeInTheDocument();
    });

    it('should save the pod provider url and provide a confirmation message', async () => {
      render(<OptionsPage />);
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
      expect(await screen.findByText('URL was saved')).toBeInTheDocument();
    });
  });
});
