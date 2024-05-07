import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './main.module.css';
import LetterRow from '../letterRow/letterRow';

const Main = () => {
  
  // const size = 5;
  const tries = 6;
  // const answer = 'PARIS';

  const [size, setSize] = useState(5);
  const [answer, setAnswer] = useState('PARIS');
  const [currRound, setCurrRound] = useState(0)
  const [currWord, setCurrWord] = useState(Array(size).fill(' ').join(''))
  const [wordHistory, setWordHistory] = useState([])
  const [selectedCol, setSelectedCol] = useState(0)
  const [cityNames, setCityNames] = useState([])
  const [locked, setLocked] = useState(false)

  const getNewAnswer = (cities=cityNames) => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    setAnswer(normalize(cities[randomIndex]));
    setSize(cities[randomIndex].length);
    console.log(cities[randomIndex]);
  }

  const normalize = (str) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/estados-sc.json');
        const data = await response.json();
        // console.log(data); // Do something with the data

        const cidades = data
        // .filter(cidade => cidade.municipio.microrregiao.id === 42019)
        .map(cidade => cidade.nome).filter(
          nome => nome.length < 10
        );
        setCityNames(cidades);
        getNewAnswer(cidades);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const goLeft = () => {
    if (selectedCol === 0) return;
    if (answer[selectedCol - 1] === ' ') {
      setSelectedCol(selectedCol - 2);
      return;
    }
    setSelectedCol(selectedCol - 1);
  }

  const goRight = () => {
    if (selectedCol === size - 1) return;
    if (answer[selectedCol + 1] === ' ') {
      setSelectedCol(selectedCol + 2);
      return;
    }
    setSelectedCol(selectedCol + 1);
  }

  const replaceLetterinWord = (letter, idx) => {
    let newWord = currWord;
    newWord = newWord.substring(0, idx) + letter + newWord.substring(idx + 1)
    setCurrWord(normalize(newWord));
  }

  const checkWord = () => {
    if (normalize(currWord) === normalize(answer)) {
      setWordHistory([...wordHistory, currWord]);
      setCurrRound(currRound + 1);
      setCurrWord(Array(size).fill(' ').join(''));
      setSelectedCol(-1);
      setLocked(true);
      alert('You won!');
      // reset();
      return;
    }
    if (currRound === tries - 1) {
      alert('You lost!');
      reset();
      return;
    }
    setCurrRound(currRound + 1);
    setWordHistory([...wordHistory, currWord]);
    setCurrWord(Array(size).fill(' ').join(''));
    setSelectedCol(0);
  }

  const reset = () => {
    setCurrRound(0);
    setCurrWord(Array(size).fill(' ').join(''));
    setWordHistory([]);
    setSelectedCol(0);
    getNewAnswer();
    setLocked(false);
  }

  const handleKeyDown = (e) => {
    if (selectedCol === -1) return;
    if (locked) return;
    if (e.key === 'Backspace') {
      if (currWord.length === 0) return;
      if (currWord[selectedCol] === ' ') {
        goLeft();
        replaceLetterinWord(' ', selectedCol - 1);
      }else {
        replaceLetterinWord(' ', selectedCol);
      }      
      return;
    }
    if (e.key === 'ArrowLeft') {
      goLeft();
      return;
    } else if (e.key === 'ArrowRight') {
      goRight();
      return;
    }
    if (e.key === 'Enter') {
      checkWord();
      return;
    }
    if (e.key === ' ') return;
    if (e.key.length !== 1) return;

    if (selectedCol < size) {
      replaceLetterinWord(e.key, selectedCol);
      goRight();
    }
  }

  return (
  <div 
  className={styles.Main} 
  data-testid="Main"
  onKeyDown={(e) => {
    handleKeyDown(e);
  }}
  >
    <div className={styles.container}> 
      <span className={styles.title}>Cidadle</span>
      <span className={styles.subtitle}>Guess the City</span>
      <div className={styles.gameContainer}>
        <span className={styles.subtitle}>{size} Letters</span>
        {Array(tries).fill().map((_, i) => (
          <LetterRow 
            key={i}
            size={size}
            selectedCol={selectedCol}
            onClick={(letteridx) => {
              if (i !== currRound) return;
              if (locked) return;
              setSelectedCol(letteridx);
            }}
            isActive={i === currRound}
            word={i === currRound ? currWord.toLowerCase() : wordHistory[i]}
            answer={answer.toLowerCase()}
          />
        ))}
        <button
          className={styles.checkBtn}
          onClick={checkWord}
        >
          Check
        </button>
      </div>
      <button
        className={styles.resetBtn}
        onClick={(event) => {
          event.target.blur();
          reset();
        }}
      >
        Reset
      </button>
    </div>
  </div>
)};

Main.propTypes = {};

Main.defaultProps = {};

export default Main;
