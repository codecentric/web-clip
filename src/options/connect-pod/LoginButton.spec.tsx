import { fireEvent, render, screen } from '@testing-library/react';
import { when } from 'jest-when';
import React from 'react';
import { LoginButton } from './LoginButton';
import { useLogin } from './useLogin';

jest.mock('./useLogin');

describe('LoginButton', () => {
  it('triggers login when clicked', () => {
    const login = jest.fn();
    when(useLogin).calledWith('http://pod.test').mockReturnValue({
      loading: false,
      login,
    });
    render(<LoginButton oidcIssuer="http://pod.test" />);
    const button = screen.getByText('Login');
    fireEvent.click(button);
    expect(login).toHaveBeenCalled();
  });

  it('indicates loading', () => {
    when(useLogin).calledWith('http://pod.test').mockReturnValue({
      loading: true,
      login: jest.fn(),
    });
    render(<LoginButton oidcIssuer="http://pod.test" />);
    expect(screen.getByText('Signing in')).toBeInTheDocument();
  });
});
