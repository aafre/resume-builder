import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MdPerson } from 'react-icons/md';
import { GhostButton } from '../GhostButton';

describe('GhostButton', () => {
  it('renders with text content', () => {
    render(<GhostButton>Add Experience</GhostButton>);

    const button = screen.getByRole('button', { name: /add experience/i });
    expect(button).toBeInTheDocument();
  });

  it('renders default add icon', () => {
    const { container } = render(<GhostButton>Add Item</GhostButton>);

    // MdAdd icon should be present
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<GhostButton icon={<MdPerson data-testid="custom-icon" />}>Add Person</GhostButton>);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<GhostButton onClick={handleClick}>Add Item</GhostButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has dashed border styling', () => {
    render(<GhostButton>Add Item</GhostButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-dashed');
    expect(button).toHaveClass('border-2');
  });

  it('is full width', () => {
    render(<GhostButton>Add Item</GhostButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<GhostButton disabled onClick={handleClick}>Add Item</GhostButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    render(<GhostButton className="mt-4">Add Item</GhostButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('mt-4');
  });
});
