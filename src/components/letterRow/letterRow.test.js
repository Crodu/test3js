import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LetterRow from './LetterRow';

describe('<LetterRow />', () => {
  test('it should mount', () => {
    render(<LetterRow />);
    
    const letterRow = screen.getByTestId('LetterRow');

    expect(letterRow).toBeInTheDocument();
  });
});