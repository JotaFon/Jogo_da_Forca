const mysql = require('mysql2');

//DADOS PARA CONEXÃO COM O BANCO DE DADOS
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Jota',
  password: '3631Jotinha',
  database: 'forca',
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return;
  }

  console.log('Conexão estabelecida com sucesso!');

//TEMAS E PALAVRAS 
  const temas = {
    Animais: ['cachorro', 'pato', 'gato', 'tartaruga', 'peixe', 'minhoca', 'rato', 'leão', 'pinguim', 'hamster', 'leopardo', 'onça', 'elefante', 'girafa', 'borboleta', 'coelho', 'macaco', 'cobra', 'águia', 'panda', 'cavalo', 'baleia', 'formiga', 'papagaio', 'abelha', 'tigre'],
    Comidas: ['pizza', 'arroz', 'hambúrguer', 'sorvete', 'macarrão', 'batata', 'sushi', 'chocolate', 'salada', 'pão', 'lasanha', 'bolo', 'frango', 'sanduíche', 'sopa', 'brigadeiro', 'queijo', 'pipoca', 'churrasco', 'panqueca', 'iogurte', 'torta', 'biscoito', 'morango', 'abacate', 'cebola'],
    Países: ['Brasil', 'China', 'Alemanha', 'Japão', 'Estados Unidos', 'Argentina', 'Bolivia', 'França', 'Mexico', 'Canada', 'Italia', 'Espanha', 'Portugal', 'Inglaterra', 'Austrália', 'Rússia', 'Suíça', 'Índia', 'Coreia do Sul', 'África do Sul', 'Colômbia', 'Chile', 'Holanda', 'Suécia', 'Peru', 'Noruega'],
    Filmes: ['titanic', 'harry potter', 'matrix', 'avatar', 'o senhor dos anéis', 'pantera negra', 'interestelar', 'homem-aranha: longe de casa', 'o poderoso chefão', 'star wars', 'o lobo de wall street', 'pulp fiction', 'o grande gatsby', 'os vingadores', 'frozen', 'moana', 'divertida mente', 'velozes e furiosos', 'it: a coisa', 'a bela e a fera', 'o rei leão', 'batman', 'o hobbit'],
    Esportes: ['futebol', 'basquete', 'tênis', 'natação', 'vôlei', 'atletismo', 'golfe', 'handebol', 'ginástica', 'boxe', 'surfe', 'hóquei', 'ciclismo', 'esqui', 'rugby', 'judô', 'karatê', 'remo', 'skate', 'pólo aquático', 'badminton', 'tiro com arco', 'squash', 'saltos ornamentais', 'canoagem', 'taekwondo']
  };  

  const insertQuery = 'INSERT INTO texto (tema, palavra) VALUES (?, ?) ON DUPLICATE KEY UPDATE palavra = palavra';
  
  //UTILIZADO PARA ADICIONAR NOVAS PALAVRAS AO JOGO
  for (const tema in temas) {
    const palavras = temas[tema];
    for (const palavra of palavras) {
      const selectQuery = 'SELECT palavra FROM texto WHERE palavra = ?';
      connection.query(selectQuery, [palavra], (error, results) => {
        if (error) {
          console.error('Erro ao verificar palavra existente:', error);
        } else {
          if (results.length > 0) {
            console.log(`A palavra "${palavra}" já existe no banco de dados.`);
          } else {
            connection.query(insertQuery, [tema, palavra], (error, results) => {
              if (error) {
                console.error('Erro ao inserir palavra:', error);
              } else {
                console.log(`Palavra inserida com sucesso: ${palavra}`);
              }
            });
          }
        }
      });
    }
  }

  //UTILIZAR PARA EXCLUIR PALAVRAS DO JOGO
  /*excluirPalavra('vingadores: ultimato', connection, (error, results) => {
    if (error) {
      console.error('Erro ao excluir palavra:', error);
    } else {
      console.log('Palavra excluída com sucesso!');
    }
  });*/

  //UTILIZAR PARA VER AS PALAVRAS PRESENTES NO BANCO DE DADOS
  const selectQuery = 'SELECT palavra FROM texto';
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Erro ao buscar palavras:', error);
    } else {
      console.log('Palavras no banco de dados:');
      results.forEach((row) => {
        console.log(row.palavra);
      });
    }
  });
});
module.exports = connection;
const { excluirPalavra,
  getPalavraAleatoria,
  getTemaAleatorio,
  palavraSecreta 
  } = require('./functions.js');