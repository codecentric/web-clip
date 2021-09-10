import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ToolbarContainer } from './ToolbarContainer';
import { usePage } from './usePage';
import { useProfile } from './useProfile';
import { usePageData } from './usePageData';
import { useBookmark } from './useBookmark';

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

    (usePageData as jest.Mock).mockReturnValue({
      loading: false,
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
});
