import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ToolbarContainer } from './ToolbarContainer';
import { useBookmark } from './useBookmark';
import { useProfile } from './useProfile';

jest.mock('./useProfile');
jest.mock('./useBookmark');

describe('ToolbarContainer', () => {
  const { location } = window;

  let addBookmark: jest.Mock;
  beforeEach(() => {
    delete window.location;
    window.location = { ...location };
    window.location.href = '';
    window.document.title = '';

    (useProfile as jest.Mock).mockReturnValue({
      loading: false,
      profile: { name: 'Jane Doe' },
    });

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
    render(<ToolbarContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it("renders the user's name", () => {
    render(<ToolbarContainer />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  describe('bookmarking', () => {
    it("saves a web page to the user's pod", () => {
      window.location.href = 'https://page.example/article';
      window.document.title = 'An interesting article';
      render(<ToolbarContainer />);
      const button = screen.getByText('Clip it!');
      fireEvent.click(button);
      expect(addBookmark).toHaveBeenCalledWith({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
    });

    it('disables the clip it button and shows a saving message while the bookmark is being saved', () => {
      (useBookmark as jest.Mock).mockReturnValue({
        loading: true,
        error: null,
        addBookmark,
      });

      render(<ToolbarContainer />);

      expect(screen.queryByText('Clip it!')).not.toBeInTheDocument();
      const button = screen.getByText('Saving...');
      expect(button).toBeDisabled();
    });

    it('shows an error if the bookmark cannot be saved', () => {
      (useBookmark as jest.Mock).mockReturnValue({
        loading: false,
        error: new Error('Pod not available'),
        addBookmark,
      });

      render(<ToolbarContainer />);

      expect(screen.getByText('Pod not available')).toBeInTheDocument();
      const button = screen.getByText('Clip it!');
      expect(button).not.toBeDisabled();
    });
  });
});
