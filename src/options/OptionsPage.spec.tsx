import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { OptionsPage } from './OptionsPage';
import { useOptionsStorage } from './useOptionsStorage';

jest.mock('./useOptionsStorage');

describe('OptionsPage', () => {
  let saveOptions: jest.Mock;
  beforeEach(() => {
    saveOptions = jest.fn();
    (useOptionsStorage as jest.Mock).mockReturnValue({
      save: saveOptions,
    });
  });

  it('should allow to input a Solid IDP URI', () => {
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    expect(input).toBeInTheDocument();
  });

  it('shows solidcommunity.net as default provider URL in the input', () => {
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    expect(input).toHaveValue('https://solidcommunity.net');
  });

  it('allows to change the provider url', () => {
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    userEvent.clear(input);
    userEvent.type(input, 'https://another.provider.example');

    expect(input).toHaveValue('https://another.provider.example');
  });

  it('should have a save button', () => {
    render(<OptionsPage />);
    const button = screen.getByText('Save');
    expect(button).toBeInTheDocument();
  });

  it('should save the pod provider url', () => {
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    fireEvent.change(input, {
      target: {
        value: 'https://pod.provider.example',
      },
    });
    const button = screen.getByText('Save');
    fireEvent.click(button);
    expect(saveOptions).toHaveBeenCalledWith({
      providerUrl: 'https://pod.provider.example',
    });
  });
});
