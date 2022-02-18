import { render, screen } from '@testing-library/react';
import React from 'react';
import { ToolbarContainer } from './ToolbarContainer';
import { useLegacyBookmark } from './useLegacyBookmark';
import { usePage } from './usePage';
import { useLegacyPageData } from './useLegacyPageData';
import { useLegacyProfile } from './useLegacyProfile';

jest.mock('./useLegacyProfile');
jest.mock('./useLegacyBookmark');
jest.mock('./useLegacyPageData');
jest.mock('./usePage');

describe('ToolbarContainer', () => {
  const { location } = window;
  let addBookmark: jest.Mock;

  beforeEach(() => {
    delete window.location;
    window.location = { ...location };
    window.location.href = '';
    window.document.title = '';

    (useLegacyProfile as jest.Mock).mockReturnValue({
      loading: false,
      profile: { name: 'Jane Doe' },
    });

    (usePage as jest.Mock).mockReturnValue({});

    (useLegacyPageData as jest.Mock).mockReturnValue({
      loading: false,
    });

    addBookmark = jest.fn();
    (useLegacyBookmark as jest.Mock).mockReturnValue({
      loading: false,
      addBookmark,
    });
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders loading indicator while profile is loading', () => {
    (useLegacyProfile as jest.Mock).mockReturnValue({
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
    (useLegacyPageData as jest.Mock).mockReturnValue({
      loading: true,
    });
    render(<ToolbarContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(useLegacyPageData).toHaveBeenCalledWith('https://page.example/');
  });

  it("renders the user's name", () => {
    render(<ToolbarContainer />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
