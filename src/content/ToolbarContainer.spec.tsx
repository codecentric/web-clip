import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ToolbarContainer } from './ToolbarContainer';
import { useBookmark } from './useBookmark';
import { usePage } from './usePage';
import { useProfile } from './useProfile';
import { usePageData } from './usePageData';

jest.mock('./useProfile');
jest.mock('./useBookmark');
jest.mock('./usePageData');
jest.mock('./usePage');

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

    (usePage as jest.Mock).mockReturnValue({});

    addBookmark = jest.fn();
    (useBookmark as jest.Mock).mockReturnValue({
      loading: false,
      addBookmark,
    });
    (usePageData as jest.Mock).mockReturnValue({
      loading: false,
    });
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders loading indicator while profile is loading', () => {
    (useProfile as jest.Mock).mockReturnValue({
      loading: true,
      profile: null,
    });
    render(<ToolbarContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading indicator while page data is loading', () => {
    (usePage as jest.Mock).mockReturnValue({
      url: 'https://page.example/',
    });
    (usePageData as jest.Mock).mockReturnValue({
      loading: true,
    });
    render(<ToolbarContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(usePageData).toHaveBeenCalledWith('https://page.example/');
  });

  it("renders the user's name", () => {
    render(<ToolbarContainer />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  describe('bookmarking', () => {
    it("saves a web page to the user's pod", () => {
      (usePage as jest.Mock).mockReturnValue({
        type: 'WebPage',
        url: 'https://page.example/article',
        name: 'An interesting article',
      });
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
