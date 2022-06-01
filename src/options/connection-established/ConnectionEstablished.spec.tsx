import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';

import { ConnectionEstablished } from './ConnectionEstablished';
import { useConnectionEstablished } from './useConnectionEstablished';

jest.mock('./useConnectionEstablished');

describe('ConnectionEstablished', () => {
  it('shows the connected provider url', () => {
    when(useConnectionEstablished).mockReturnValue({
      providerUrl: 'https://pod.test',
      disconnect: () => null,
    });
    render(<ConnectionEstablished />);
    expect(screen.queryByText('https://pod.test')).toBeInTheDocument();
  });

  it('disconnects when clicking the respective link', () => {
    const disconnect = jest.fn();
    when(useConnectionEstablished).mockReturnValue({
      providerUrl: 'https://pod.test',
      disconnect,
    });
    render(<ConnectionEstablished />);
    const disconnectButton = screen.getByText('Disconnect');
    userEvent.click(disconnectButton);
    expect(disconnect).toHaveBeenCalled();
  });
});
