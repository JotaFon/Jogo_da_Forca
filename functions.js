const connection = require('./database.js');
const diacritic = require('diacritic');

//FUNÇÃO PARA DEFINIR UM TEMA ALEATORIO DE PALAVRAS
function getTemaAleatorio() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT DISTINCT tema FROM texto', (error, results) => {
      if (error) {
        reject(error);
      } else {
        const temas = results.map((row) => row.tema);
        const randomIndex = Math.floor(Math.random() * temas.length);
        resolve(temas[randomIndex]);
      }
    });
  });
}

//FUNÇÃO PARA DEFINIR UMA PALAVRA ALEATORIA DO TEMA ESCOLHIDO 
function getPalavraAleatoria(tema) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT palavra FROM texto WHERE tema = ? ORDER BY RAND() LIMIT 1';
    connection.query(query, [tema], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      if (results.length === 0) {
        reject(new Error('Nenhuma palavra encontrada para o tema.'));
        return;
      }

      const palavra = results[0].palavra;
      resolve(palavra);
    });
  });
}

//FUNÇÃO PARA TRANSFORMAR A PALAVRA EM *
function palavraSecreta(letra) {
  return letra.replace(/[\p{L}\p{M}]/gu, (match) => {
    if (match === ' ') {
      return ' ';
    } else {
      return '*';
    }
  });
}

// FUNÇÃO PARA EXCLUIR A PALAVRA DO BANCO DE DADOS
function excluirPalavra(palavra, connection, callback) {
  const deleteQuery = 'DELETE FROM texto WHERE palavra = ?';

  connection.query(deleteQuery, [palavra], (error, results) => {
    if (error) {
      console.error('Erro ao excluir palavra:', error);
      callback(error);
    } else {
      console.log(`Palavra "${palavra}" excluída com sucesso.`);
      callback(null, results);
    }
  });
}
module.exports = {
  getPalavraAleatoria,
  getTemaAleatorio,
  palavraSecreta,
  excluirPalavra
};
