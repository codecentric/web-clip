import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SolidApi } from '../api/solidApi';
import { useSolidApi } from '../api/apiContext';
import { Toolbar } from './Toolbar';

jest.mock('../api/apiContext');

describe('Toolbar', () => {
  const { location } = window;

  beforeEach(() => {
    delete window.location;
    window.location = { ...location };
  });

  afterEach(() => {
    window.location = location;
  });

  it("renders the user's web id", () => {
    render(<Toolbar webId={'some_id'} />);
    expect(screen.getByText('some_id')).toBeInTheDocument();
  });

  it("saves a web page to the user's pod", () => {
    const solidApi = mockSolidApi();
    window.location.href = 'https://page.example/article';
    window.document.title = 'An interesting article';
    render(<Toolbar webId={'some_id'} />);
    const button = screen.getByText('Clip it!');
    fireEvent.click(button);
    expect(solidApi.bookmark).toHaveBeenCalledWith({
      type: 'WebPage',
      url: 'https://page.example/article',
      name: 'An interesting article',
    });
  });

  function mockSolidApi() {
    const solidApi = {
      bookmark: jest.fn(),
    };
    (useSolidApi as jest.Mock<SolidApi>).mockReturnValue(solidApi);
    return solidApi;
  }
});
