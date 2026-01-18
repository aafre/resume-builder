import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ActionIcon } from '../ActionIcon';

describe('ActionIcon', () => {
  it('renders with icon and label', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete item" />);

    const button = screen.getByRole('button', { name: 'Delete item' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Delete item');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ActionIcon icon={<MdEdit />} label="Edit" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies neutral variant styles by default', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-gray-500');
  });

  it('applies danger variant styles', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete" variant="danger" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-gray-400');
  });

  it('applies sm size styles', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete" size="sm" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-1');
    expect(button).toHaveClass('text-sm');
  });

  it('applies md size styles by default', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-1.5');
    expect(button).toHaveClass('text-base');
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<ActionIcon icon={<MdDelete />} label="Delete" disabled onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    render(<ActionIcon icon={<MdDelete />} label="Delete" className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
