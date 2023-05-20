const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/css'));

const themes = {
  animais: ['cachorro', 'pato', 'gato', 'elefante', 'leão', 'tigre', 'girafa', 'macaco'],
  comida: ['pizza', 'hambúrguer', 'sorvete', 'macarrão', 'batata', 'lasanha', 'sushi', 'chocolate']
};

let wrongGuesses = 5;
let heartsRemaining = 5;
let maskedWord = '';
let word = '';
let usedLetters = [];
let usedLettersString = '';
let theme = 'animais';

function getRandomTheme() {
  const themeKeys = Object.keys(themes);
  const randomIndex = Math.floor(Math.random() * themeKeys.length);
  return themeKeys[randomIndex];
}

function getRandomWord() {
  const themeWords = themes[theme];
  const randomIndex = Math.floor(Math.random() * themeWords.length);
  return themeWords[randomIndex];
}

function maskWord(word) {
  return word.replace(/./g, '*');
}

app.get('/', (req, res) => {
  const playAgain = req.query.playAgain === 'true';

  if (playAgain) {
    heartsRemaining = 5;
  }
  theme = getRandomTheme();
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
    heartsRemaining,
    playAgain,
    wrongGuesses,
    theme
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
      heartsRemaining--;
    }
  }

  if (heartsRemaining === 0) {
    gameOver = true;
    gameOverMessage = 'Você perdeu!';
  }

  res.render('index', {
    word,
    maskedWord,
    usedLetters,
    usedLettersString,
    gameOver,
    gameOverMessage,
    wrongGuesses,
    heartsRemaining,
    theme
  });
  }
);
app.get('/change-theme/:newTheme', (req, res) => {
  const newTheme = req.params.newTheme;

  if (themes[newTheme]) {
    theme = newTheme;
    word = getRandomWord();
    res.redirect('/');
  } else {
    res.status(404).send('Tema não encontrado.');
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
    wrongGuesses,
    theme
  });
});

try {
  app.listen(PORT, () => {
    console.log(`Esse servidor está rodando em http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
}
