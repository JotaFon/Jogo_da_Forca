const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/css'));

const words = [
  'cachorro', 'pato', 'gato', 'elefante', 'leão', 'tigre', 'girafa', 'macaco', 'coelho',
  'cavalo', 'zebra', 'leopardo', 'rinoceronte', 'veado', 'lobo', 'tartaruga', 'peixe', 'cobra'
];

let wrongGuesses = 5;
let maskedWord = '';
let word = '';
let usedLetters = [];
let usedLettersString = '';

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function maskWord(word) {
  return word.replace(/./g, '*');
}

app.get('/', (req, res) => {
  const playAgain = req.query.playAgain === 'true';

  if (playAgain) {
    wrongGuesses = 5;
  }

  word = getRandomWord();
  maskedWord = maskWord(word);

  usedLetters = [];
  usedLettersString = '';

  let gameOver = false;
  let gameOverMessage = '';

  res.render('index', {
    word,
    maskedWord,
    usedLetters,
    usedLettersString,
    gameOver,
    gameOverMessage,
    wrongGuesses,
    playAgain
  });
});

app.post('/', (req, res) => {
  const guess = req.body.guess.toLowerCase();

  let gameOver = false;
  let gameOverMessage = '';

  if (!usedLetters.includes(guess)) {
    usedLetters.push(guess);
    usedLettersString = usedLetters.join(', ');

    let correctGuess = false;
    const maskedArray = maskedWord.split('');

    for (let i = 0; i < word.length; i++) {
      if (word[i] === guess) {
        maskedArray[i] = guess;
        correctGuess = true;
      }
    }

    if (correctGuess) {
      maskedWord = maskedArray.join('');

      if (!maskedWord.includes('*')) {
        gameOver = true;
        gameOverMessage = 'Parabéns, você acertou!';
      }
    } else {
      wrongGuesses--;
    }
  }

  if (gameOver) {
    res.render('index', {
      word,
      maskedWord,
      usedLetters,
      usedLettersString,
      gameOver,
      gameOverMessage,
      wrongGuesses,
      playAgain: true
    });
  } else {
    res.render('index', {
      word,
      maskedWord,
      usedLetters,
      usedLettersString,
      gameOver,
      gameOverMessage,
      wrongGuesses
    });
  }
});

app.get('/reset', (req, res) => {
  wrongGuesses = 5;
  word = getRandomWord();
  maskedWord = maskWord(word);

  usedLetters = [];
  usedLettersString = '';

  let gameOver = false;
  let gameOverMessage = '';

  res.render('index', {
    word,
    maskedWord,
    usedLetters,
    usedLettersString,
    gameOver,
    gameOverMessage,
    wrongGuesses
  });
});


function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function maskWord(word) {
  return word.replace(/./g, '*');
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Esse servidor está rodando em http://localhost:${PORT}`);
});
