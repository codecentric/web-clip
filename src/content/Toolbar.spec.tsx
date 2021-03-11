import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { mockSolidApi } from '../test/solidApiMock';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  const { location } = window;

  beforeEach(() => {
    delete window.location;
    window.location = { ...location };
  });

  afterEach(() => {
    window.location = location;
  });

  it("renders the user's name", () => {
    const solidApi = mockSolidApi();
    solidApi.getProfile.mockReturnValue({ name: 'Jane Doe' });
    render(<Toolbar />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it("saves a web page to the user's pod", () => {
    const solidApi = mockSolidApi();
    solidApi.getProfile.mockReturnValue({ name: 'Jane Doe' });
    window.location.href = 'https://page.example/article';
    window.document.title = 'An interesting article';
    render(<Toolbar />);
    const button = screen.getByText('Clip it!');
    fireEvent.click(button);
    expect(solidApi.bookmark).toHaveBeenCalledWith({
      type: 'WebPage',
      url: 'https://page.example/article',
      name: 'An interesting article',
    });
  });
});
