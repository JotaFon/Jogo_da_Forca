const express = require('express');
const diacritic = require('diacritic');
const app = express();
const PORT = 3000;
const { connection, criarTabelas } = require('./database.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/css'));

const {
  getPalavraAleatoria,
  getTemaAleatorio,
  palavraSecreta
} = require('./functions.js');

let PalpiteErrado = 5;
let coracoes = 5;
let letra = '';
let letraUsada = [];
let letraUsadaString = '';
let tema = '';
let palavraCerta = '';

//ROTA PARA PUXAR FUNCTIONS E RENDERIZAR A PAGINA 
app.get('/', (req, res) => {
  const jogarNovamente = req.query.jogarNovamente === 'true';
  let Fim = false;
  let FimMensagem = '';

  if (jogarNovamente) {
    coracoes = 5;
  }

  getTemaAleatorio()
    .then((randomTema) => {
      tema = randomTema;
      return getPalavraAleatoria(tema);
    })
    .then((randomPalavra) => {
      letra = randomPalavra;
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
    })
    .catch((error) => {
      console.error('Erro ao recuperar tema ou palavra:', error);
      res.status(500).send('Erro ao recuperar tema ou palavra.');
    });
});

//ROTA PARA VERIFICAR E APRESENTAR O JOGO
app.post('/', (req, res) => {
  const guess = req.body.guess.toLowerCase();
  let letraPalpite = guess;
  const guessUpper = req.body.guess.toUpperCase();
  let Fim = false;
  let FimMensagem = '';

  if (!letraUsada.includes(letraPalpite) && letraUsada.includes(guessUpper)) {
    letraPalpite = guessUpper;
  }
  if (!letraUsada.includes(letraPalpite)) {
    if (letraPalpite.length > 1) {
      letraPalpite = letraPalpite.charAt(0);
    }
    letraUsada.push(letraPalpite);
    letraUsadaString = letraUsada.join(', ');
    let palpiteCorreto = false;
    const arraySecreto = letraSecreta.split('');

    for (let i = 0; i < letra.length; i++) {
      const letraSemAcento = diacritic.clean(letra[i]).toLowerCase();
      const palpiteSemAcento = diacritic.clean(letraPalpite).toLowerCase();
      if (letraSemAcento === palpiteSemAcento) {
        arraySecreto[i] = letra[i];
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

//ROTA PARA MUDAR O TEMA ALEATORIAMENTE
app.get('/change-theme/:newTheme', (req, res) => {
  const newTheme = req.params.newTheme;
  res.redirect('/');
});

//ROTA PARA RECOMEÇAR O JOGO
app.get('/reset', (req, res) => {
  PalpiteErrado = 5;
  getPalavraAleatoria(tema)
    .then((palavra) => {
      letra = palavra;
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
    })
    .catch((error) => {
      console.error('Erro ao recuperar palavra:', error);
      res.status(500).send('Erro ao recuperar palavra.');
    });
});

//STATUS DO SERVIDOR
try {
  app.listen(PORT, () => {
    console.log(`O servidor está rodando em http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
}
