import { fireEvent, render, screen } from '@testing-library/react';
import { when } from 'jest-when';
import React from 'react';
import { ConnectPodButton } from './ConnectPodButton';
import { useLogin } from './useLogin';

jest.mock('./useLogin');

describe('LoginButton', () => {
  it('triggers login when clicked', () => {
    const login = jest.fn();
    when(useLogin)
      .calledWith('http://pod.test', expect.anything())
      .mockReturnValue({
        loading: false,
        error: null,
        login,
      });
    render(
      <ConnectPodButton oidcIssuer="http://pod.test" onLogin={() => null} />
    );
    const button = screen.getByText('Connect Pod');
    fireEvent.click(button);
    expect(login).toHaveBeenCalled();
  });

  it('indicates loading', () => {
    when(useLogin)
      .calledWith('http://pod.test', expect.anything())
      .mockReturnValue({
        loading: true,
        error: null,
        login: jest.fn(),
      });
    render(
      <ConnectPodButton oidcIssuer="http://pod.test" onLogin={() => null} />
    );
    expect(screen.getByText('Signing in')).toBeInTheDocument();
  });
});
