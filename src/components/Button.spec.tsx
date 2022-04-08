import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('triggers click handler when clicked', () => {
    const onClick = jest.fn();
    render(
      <Button loading={false} loadingLabel="Loading" onClick={onClick}>
        Click me
      </Button>
    );
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('shows loading label when loading', () => {
    render(
      <Button loading={true} loadingLabel="Loading" onClick={() => null}>
        Click me
      </Button>
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
