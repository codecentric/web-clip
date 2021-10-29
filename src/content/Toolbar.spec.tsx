import { usePage } from './usePage';
import { fireEvent, render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { useBookmark } from './useBookmark';
import React from 'react';

jest.mock('./useBookmark');
jest.mock('./usePage');

describe('Toolbar', () => {
  let addBookmark: jest.Mock;

  beforeEach(() => {
    addBookmark = jest.fn();
    (useBookmark as jest.Mock).mockReturnValue({
      saving: false,
      addBookmark,
    });
  });

  it("renders the user's name", () => {
    render(<Toolbar profile={{ name: 'Jane Doe' }} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  describe('bookmarking', () => {
    it('uses data from page to bookmark', () => {
      (usePage as jest.Mock).mockReturnValue({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
      render(<Toolbar profile={{ name: 'Jane Doe' }} />);
      expect(useBookmark).toHaveBeenCalledWith({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
    });

    it("saves a web page to the user's pod", () => {
      (usePage as jest.Mock).mockReturnValue({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
      render(<Toolbar profile={{ name: 'Jane Doe' }} />);
      const button = screen.getByText('Clip it!');
      fireEvent.click(button);
      expect(addBookmark).toHaveBeenCalledWith();
    });

    it('disables the clip it button and shows a saving message while the bookmark is being saved', () => {
      (useBookmark as jest.Mock).mockReturnValue({
        saving: true,
        error: null,
        addBookmark,
      });

      render(<Toolbar profile={{ name: 'Jane Doe' }} />);

      expect(screen.queryByText('Clip it!')).not.toBeInTheDocument();
      const button = screen.getByText('Saving...');
      expect(button).toBeDisabled();
    });

    it('shows an error if the bookmark cannot be saved', () => {
      (useBookmark as jest.Mock).mockReturnValue({
        saving: false,
        error: new Error('Pod not available'),
        addBookmark,
      });

      render(<Toolbar profile={{ name: 'Jane Doe' }} />);

      expect(screen.getByText('Pod not available')).toBeInTheDocument();
      const button = screen.getByText('Clip it!');
      expect(button).not.toBeDisabled();
    });

    it('shows a link to the bookmark after it has been saved', () => {
      (useBookmark as jest.Mock).mockReturnValue({
        saving: false,
        bookmark: { uri: 'https://storage.example/bookmark#it' },
        addBookmark,
      });

      render(<Toolbar profile={{ name: 'Jane Doe' }} />);

      expect(screen.getByText('Show in pod').getAttribute('href')).toBe(
        'https://storage.example/bookmark#it'
      );
    });
  });
});
