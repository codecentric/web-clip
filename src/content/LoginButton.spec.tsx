import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { mockSolidApi } from '../test/solidApiMock';
import { LoginButton } from './LoginButton';

describe('LoginButton', () => {
  it('triggers solid login when clicked', () => {
    const solidApi = mockSolidApi();

    render(<LoginButton />);
    const button = screen.getByText('Login');
    fireEvent.click(button);
    expect(solidApi.login).toHaveBeenCalled();
  });
});
