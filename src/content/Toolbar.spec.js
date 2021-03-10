import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it("renders the user's web id", () => {
    render(<Toolbar webId={'some_id'} />);

    expect(screen.getByText('some_id')).toBeInTheDocument();
  });
});
