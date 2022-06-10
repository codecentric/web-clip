import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MessageType } from '../domain/messages';
import { sendMessage } from './sendMessage';
import { SetupButton } from './SetupButton';

jest.mock('./sendMessage');

describe('SetupButton', () => {
  it('triggers open option page message and calls close when clicked', () => {
    const close = jest.fn();
    render(<SetupButton close={close} />);
    const button = screen.getByText('Get started');
    fireEvent.click(button);
    expect(sendMessage).toHaveBeenCalledWith({
      type: MessageType.OPEN_OPTIONS,
    });
    expect(close).toHaveBeenCalled();
  });
});
