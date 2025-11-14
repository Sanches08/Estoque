//Importa o pacote 'pg' (PostgreeSQL) para conectar o banco de dados
import pkg from 'pg';
//Extrai o objeto 'Pool', usado para gerenciar as regras de interação com o banco
const { Pool } = pkg;
//Cria uma nova conexão com o banco de dados PostgreSQL
const BD = new Pool({
    user: 'postgres',         //Usuário do banco
    host: 'localhost',        //Host do banco
    database: 'aureum_tech',      //Nome do banco
    password: 'admin',     //Senha do banco
    port: 5432                //Porta de comunicação com o banco
});

//Exporta a conexão para ser usada em outros arquivos
export default BD;