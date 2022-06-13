import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ChooseStorage } from './ChooseStorage';
import { useChooseStorage } from './useChooseStorage';

jest.mock('./useChooseStorage');

describe('ChooseStorage', () => {
  describe('while loading', () => {
    beforeEach(() => {
      when(useChooseStorage).mockReturnValue({
        loading: true,
        submitting: false,
        containerUrl: '',
        manualChanges: false,
        setContainerUrl: jest.fn(),
        submit: () => null,
      });
    });

    it('indicates loading', () => {
      render(<ChooseStorage />);
      expect(
        screen.getByText("Let's find a storage location for your clips.")
      ).toBeInTheDocument();
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('after loading and finding a storage', () => {
    let setContainerUrl: jest.Mock;
    beforeEach(() => {
      setContainerUrl = jest.fn();
      when(useChooseStorage).mockReturnValue({
        loading: false,
        submitting: false,
        manualChanges: false,
        containerUrl: 'https://pod.example/alice/webclip/',
        setContainerUrl,
        submit: () => null,
      });
    });

    it('shows the container url', () => {
      render(<ChooseStorage />);
      expect(
        screen.getByDisplayValue('https://pod.example/alice/webclip/')
      ).toBeInTheDocument();
    });

    it('allows to change the proposed url', () => {
      render(<ChooseStorage />);
      const input = screen.getByLabelText('Storage Location');
      act(() => {
        userEvent.paste(input, 'additional-container');
      });
      expect(setContainerUrl).toHaveBeenLastCalledWith(
        'https://pod.example/alice/webclip/additional-container'
      );
    });

    it('asks if it is ok', () => {
      render(<ChooseStorage />);
      expect(
        screen.getByText(
          'WebClip is going to store data at the following location. Confirm, if you are fine with that, or enter the URL of a different location.'
        )
      ).toBeInTheDocument();
    });

    it('allows to confirm', () => {
      render(<ChooseStorage />);
      const continueButton = screen.getByText('Confirm');
      expect(continueButton).toBeInTheDocument();
      userEvent.click(continueButton);
    });
  });

  describe('after loading and finding no storage', () => {
    let setContainerUrl: jest.Mock;
    let submit: jest.Mock;
    beforeEach(() => {
      submit = jest.fn();
      setContainerUrl = jest.fn();
      when(useChooseStorage).mockReturnValue({
        loading: false,
        submitting: false,
        containerUrl: null,
        manualChanges: true,
        setContainerUrl,
        submit,
      });
    });

    it('asks to enter a url', () => {
      render(<ChooseStorage />);
      expect(
        screen.getByText(
          'WebClip could not find a storage associated with your Pod, please enter a URL manually.'
        )
      ).toBeInTheDocument();
    });

    it('allows to enter a url manually', () => {
      render(<ChooseStorage />);
      const input = screen.getByLabelText('Storage Location');
      act(() => {
        userEvent.paste(input, 'https://pod.example/alice/webclip/');
      });
      expect(setContainerUrl).toHaveBeenLastCalledWith(
        'https://pod.example/alice/webclip/'
      );
    });

    it('allows to submit', () => {
      render(<ChooseStorage />);
      const continueButton = screen.getByText('Submit');
      expect(continueButton).toBeInTheDocument();
      userEvent.click(continueButton);
      expect(submit).toHaveBeenCalled();
    });
  });

  describe('after submitting an invalid container url', () => {
    beforeEach(() => {
      when(useChooseStorage).mockReturnValue({
        loading: false,
        submitting: false,
        manualChanges: false,
        containerUrl: 'https://pod.example/alice/webclip/',
        setContainerUrl: () => null,
        validationError: new Error('Please choose a valid container'),
        submit: () => null,
      });
    });
    it('shows the validation error', () => {
      render(<ChooseStorage />);
      expect(
        screen.getByText('Please choose a valid container')
      ).toBeInTheDocument();
    });
  });
});
