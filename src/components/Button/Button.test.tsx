import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as different element', () => {
    render(<Button as="a" href="#">Link Button</Button>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});