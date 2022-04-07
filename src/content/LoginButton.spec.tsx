import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { LoginButton } from './LoginButton';
import { useLogin } from './useLogin';

jest.mock('./useLogin');

describe('LoginButton', () => {
  it('triggers login when clicked', () => {
    const login = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      login,
    });
    render(<LoginButton />);
    const button = screen.getByText('Login');
    fireEvent.click(button);
    expect(login).toHaveBeenCalled();
  });

  it('shows error, when login failed', () => {
    (useLogin as jest.Mock).mockReturnValue({
      error: new Error('something went wrong'),
      login: jest.fn(),
    });
    render(<LoginButton />);
    expect(screen.getByText('something went wrong')).toBeInTheDocument();
  });
});
