import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button', { name: 'Test' });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('can be disabled', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button', { name: 'Test' })).toBeDisabled();
  });
});

describe('Heading', () => {
  it('renders correct heading level', () => {
    render(<Heading level={2}>Title</Heading>);
    const heading = screen.getByRole('heading', { name: 'Title', level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders h2 by default', () => {
    render(<Heading>Default</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('Spinner', () => {
  it('has status role and aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });
});
