// testaConexao.js
import BD from './db.js'; // importa a conexão criada no seu arquivo principal

try {
  const resultado = await BD.query('SELECT NOW()');
  console.log('Conexão bem-sucedida!');
  console.log('Data/hora do servidor PostgreSQL:', resultado.rows[0].now);
} catch (erro) {
  console.error('Erro ao conectar ao banco de dados:', erro.message);
} finally {
  await BD.end(); // encerra a conexão após o teste
}