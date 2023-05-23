const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/css'));

const temas = {
  Animais: ['cachorro', 'pato', 'gato', 'elefante', 'leão', 'tigre', 'girafa', 'macaco', 'cavalo', 'coelho', 'urso',
   'lobo', 'zebra', 'golfinho', 'canguru', 'camelo', 'borboleta', 'pinguim'],

  Comidas: ['pizza', 'arroz', 'hambúrguer', 'sorvete', 'macarrão', 'batata', 'lasanha', 'sushi', 'chocolate', 'bolo',
    'frango', 'sanduíche', 'salada', 'brigadeiro', 'peixe'],

  Países: ['Brasil','China','Alemanha', 'Estados Unidos', 'Rússia', 'Canadá', 'Austrália', 'Índia', 'Japão', 'México',
    'França', 'Reino Unido', 'Espanha', 'Itália', 'Argentina', 'Colômbia'],

  Filmes: ['titanic', 'harry potter', 'matrix', 'O Poderoso Chefão', 'Star Wars', 'O Senhor dos Anéis', 'Jurassic Park',
    'Forrest Gump', 'Avatar', 'A Origem', 'O Rei Leão', 'O Lobo de Wall Street', 'Os Incríveis', 'O Labirinto do Fauno', 'O Clube da Luta', 'Pulp Fiction', 'Batman'],

  Esportes: ['futebol', 'basquete', 'tênis', 'vôlei', 'natação', 'golfe', 'corrida', 'boxe', 'rugby', 'hóquei', 'handebol',
    'surf', 'skate', 'beisebol', 'ciclismo', 'ginástica', 'tiro com arco'],
};

let PalpiteErrado = 5;
let coracoes = 5;
let letra = '';
let letraUsada = [];
let letraUsadaString = '';
let tema = 'animais';
let palavraCerta = '';

function getTemaAleatorio() {
  const TemaChave = Object.keys(temas);
  const randomIndex = Math.floor(Math.random() * TemaChave.length);
  return TemaChave[randomIndex];
}

function getPalavraAleatoria() {
  let letraSecreta = '';
  const palavraTema = temas[tema];
  const randomIndex = Math.floor(Math.random() * palavraTema.length);
  return palavraTema[randomIndex];
}

function palavraSecreta(letra) {
  return letra.replace(/[\p{L}\p{M}]/gu, (match) => {
    if (match === ' ') {
      return ' ';
    } else {
      return '*';
    }
  });
}
app.get('/', (req, res) => {
  const jogarNovamente = req.query.jogarNovamente === 'true';
  let Fim = false;
  let FimMensagem = '';

  if (jogarNovamente) {
    coracoes = 5;
  }
  tema = getTemaAleatorio();
  letra = getPalavraAleatoria();
  letraSecreta = palavraSecreta(letra);
  letraUsada = [];
  letraUsadaString = '';

  res.render('index', {
    letra,
    letraSecreta,
    letraUsada,
    letraUsadaString,
    Fim,
    FimMensagem,
    coracoes,
    jogarNovamente,
    PalpiteErrado,
    tema
  });
});

app.post('/', (req, res) => {
  const guess = req.body.guess.toLowerCase();
  let letraPalpite = guess;
  let Fim = false;
  let FimMensagem = '';

  if (!letraUsada.includes(letraPalpite)) {

    if (letraPalpite.length > 1) {
      letraPalpite = letraPalpite.charAt(0);
    }
    letraUsada.push(letraPalpite);
    letraUsadaString = letraUsada.join(', ');
    let palpiteCorreto = false;
    const arraySecreto = letraSecreta.split('');

    for (let i = 0; i < letra.length; i++) {
      if (letra[i] === letraPalpite) {
        arraySecreto[i] = letraPalpite;
        palpiteCorreto = true;
      }
    }

    if (palpiteCorreto) {
      letraSecreta = arraySecreto.join('');

      if (!letraSecreta.includes('*')) {
        Fim = true;
        FimMensagem = 'Parabéns, você acertou!';
      }
    } else {
      coracoes--;
    }
  }

  if (coracoes === 0) {
    Fim = true;
    FimMensagem = 'Você perdeu!';
    palavraCerta = letra;
  }

  res.render('index', {
    letra,
    letraSecreta,
    letraUsada,
    letraUsadaString,
    Fim,
    FimMensagem,
    PalpiteErrado,
    coracoes,
    tema,
    palavraCerta
  });
});

app.get('/change-theme/:newTheme', (req, res) => {
  const newTheme = req.params.newTheme;
    res.redirect('/');
});

app.get('/reset', (req, res) => {
  PalpiteErrado = 5;
  letra = getPalavraAleatoria();
  letraSecreta = palavraSecreta(letra);
  letraUsada = [];
  letraUsadaString = '';

  let Fim = false;
  let FimMensagem = '';

  res.render('index', {
    letra,
    letraSecreta,
    letraUsada,
    letraUsadaString,
    Fim,
    FimMensagem,
    PalpiteErrado,
    tema
  });
});

try {
  app.listen(PORT, () => {
    console.log(`O servidor está rodando em http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
}
