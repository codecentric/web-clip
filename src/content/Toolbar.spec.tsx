import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Toolbar } from './Toolbar';
import { useBookmark } from './useBookmark';
import { useProfile } from './useProfile';

jest.mock('./useProfile');
jest.mock('./useBookmark');

describe('Toolbar', () => {
  const { location } = window;

  let addBookmark: jest.Mock;
  beforeEach(() => {
    delete window.location;
    window.location = { ...location };
    addBookmark = jest.fn();
    (useBookmark as jest.Mock).mockReturnValue({
      loading: false,
      addBookmark,
    });
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders loading indicator', () => {
    (useProfile as jest.Mock).mockReturnValue({
      loading: true,
      profile: null,
    });
    render(<Toolbar />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it("renders the user's name", () => {
    (useProfile as jest.Mock).mockReturnValue({
      loading: false,
      profile: { name: 'Jane Doe' },
    });
    render(<Toolbar />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  describe('bookmarking', () => {
    it("saves a web page to the user's pod", () => {
      (useProfile as jest.Mock).mockReturnValue({
        loading: false,
        profile: { name: 'Jane Doe' },
      });
      window.location.href = 'https://page.example/article';
      window.document.title = 'An interesting article';
      render(<Toolbar />);
      const button = screen.getByText('Clip it!');
      fireEvent.click(button);
      expect(addBookmark).toHaveBeenCalledWith({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
    });

    it('shows a success message after successful bookmarking', () => {});
  });
});
