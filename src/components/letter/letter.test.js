import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Letter from './Letter';

describe('<Letter />', () => {
  test('it should mount', () => {
    render(<Letter />);
    
    const letter = screen.getByTestId('Letter');

    expect(letter).toBeInTheDocument();
  });
});