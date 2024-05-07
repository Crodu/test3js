import React from 'react';
import PropTypes from 'prop-types';
import styles from './letterRow.module.css';
import Letter from '../letter/letter';

const LetterRow = ({size, word, selectedCol, isActive, onClick, answer}) => {
  
  const checkLetter = (letter, idx) => {
    if (answer[idx] === ' ') return 'empty';
    if (isActive) return 'none';
    if (answer[idx] === letter) {
      return 'correct';
    } else if (answer.includes(letter)) {
      return 'partial';
    }
    return 'none'
  }

  return (
  <div className={[styles.LetterRow, !isActive ? styles.Inactive : ''].join(' ')} data-testid="LetterRow">
    {Array(size).fill().map((_, i) => (
      <Letter 
        key={i} 
        currLetter={word[i] ? word[i] : ''}
        isSelected={selectedCol === i && isActive}
        onClick={() => {
            if (!isActive) return;
            onClick(i);
          }
        }
        type={checkLetter(word[i], i)}
      />
    ))}
  </div>
)};

LetterRow.propTypes = {
  size: PropTypes.number,
  word: PropTypes.string,
  selectedCol: PropTypes.number,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

LetterRow.defaultProps = {
  size: 5,
  word: '',
  selectedCol: 0,
  isActive: false,
  onClick: () => {},
};

export default LetterRow;
