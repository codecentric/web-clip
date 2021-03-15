import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { OptionsPage } from './OptionsPage';

import { useOptions } from './useOptions';

jest.mock('./useOptions');

describe('OptionsPage', () => {
  let saveOptions: jest.Mock;
  beforeEach(() => {
    saveOptions = jest.fn();
    (useOptions as jest.Mock).mockReturnValue({
      save: saveOptions,
    });
  });

  it('should allow to input a Solid IDP URI', () => {
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    expect(input).toBeInTheDocument();
  });

  it('shows the current provider URL in the input', () => {
    (useOptions as jest.Mock).mockReturnValue({
      providerUrl: 'https://pod.provider.example/',
      save: saveOptions,
    });
    render(<OptionsPage />);
    const input = screen.getByLabelText('Pod Provider URL');
    expect(input).toHaveValue('https://pod.provider.example/');
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
        value: 'https://pod.provider.example/',
      },
    });
    const button = screen.getByText('Save');
    fireEvent.click(button);
    expect(saveOptions).toHaveBeenCalled();
  });
});
