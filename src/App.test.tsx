import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Rendering the empty state', () => {
  test('renders location input', () => {
    render(<App />);
    const inputLabelText = screen.getByText('City Name (case sensitive)');
    const inputPlaceholderText = screen.getByPlaceholderText('type here');
    expect(inputLabelText).toBeInTheDocument();
    expect(inputPlaceholderText).toBeInTheDocument();
  });
})
