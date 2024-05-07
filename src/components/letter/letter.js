import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './letter.module.css';


const Letter = ({currLetter, isSelected, onClick, type}) => {

  return (
    <button 
      className={[styles.LetterBox, isSelected ? styles.Selected : '', styles[type]].join(' ')} 
      data-testid="Letter"
      onClick={() => onClick(currLetter)}
    >
      <span className={styles.Letter}>{currLetter}</span>
    </button>
  )
};

Letter.propTypes = {
  currLetter: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

Letter.defaultProps = {
  currLetter: '',
  isSelected: false,
  onClick: () => {},
  type: 'empty',
};

export default Letter;
