import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { LoginButton } from './LoginButton';
import { useLogin } from './useLogin';

jest.mock('./useLogin');

describe('LoginButton', () => {
  it('shows the provider url', () => {
    const login = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      login,
    });
    render(<LoginButton providerUrl="https://provider.test" />);
    const provider = screen.queryByText('https://provider.test');
    expect(provider).not.toBeNull();
  });

  it('triggers login when clicked', () => {
    const login = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      login,
    });
    render(<LoginButton providerUrl="https://provider.test" />);
    const button = screen.getByText('Login');
    fireEvent.click(button);
    expect(login).toHaveBeenCalled();
  });

  it('shows error, when login failed', () => {
    (useLogin as jest.Mock).mockReturnValue({
      error: new Error('something went wrong'),
      login: jest.fn(),
    });
    render(<LoginButton providerUrl="https://provider.test" />);
    expect(screen.getByText('something went wrong')).toBeInTheDocument();
  });

  it('indicates loading', () => {
    (useLogin as jest.Mock).mockReturnValue({
      error: null,
      loading: true,
    });
    render(<LoginButton providerUrl="https://provider.test" />);
    expect(screen.getByText('Signing in')).toBeInTheDocument();
  });
});
