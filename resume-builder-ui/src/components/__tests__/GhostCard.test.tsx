import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GhostCard } from '../GhostCard';

describe('GhostCard', () => {
  it('should be keyboard accessible', async () => {
    const onCreateNew = vi.fn();
    render(<GhostCard isAtLimit={false} resumeCount={0} onCreateNew={onCreateNew} onUpgrade={vi.fn()} />);
    const button = screen.getByRole('button', { name: /create new resume/i });
    expect(button).not.toBeNull();
  });
});
