//Importa o módulo do Express
import express from 'express'; 

//Importa a conexao com o banco de dados
import BD from '../db.js';
//Cria um objeto Router 
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await BD.query('SELECT id_usuario, login, senha, nome_usuario, ativo FROM usuario');
        res.render('usuario/lista', {usuario: result.rows});
    } catch (erro) {
        console.error("Erro ao listar professores: ", erro);
        res.render ("professores/lista",{ professores: [],
            mensagem: "Erro ao listar professores"});
    }
});


router.get('/novo', (req, res) => {
    res.render('professores/criar');
});


router.post('/novo', async (req, res) => {
    try {
        const { nome_professor, telefone, formacao } = req.body;
        await BD.query(
            `INSERT INTO professores (nome_professor, telefone, formacao) VALUES ($1, $2, $3)`,
            [nome_professor, telefone, formacao]
        );
        res.redirect('/professores');
    } catch (erro) {
        console.error("Erro ao criar professor: ", erro);
        res.render('professores/criar', 
        { mensagem: "Erro ao criar professor" });
    }
});


//editar
router.get('/:id/editar', async (req, res) => {
    try {
        const {id} = req.params;

console.log(id)

        const result = await BD.query(
            'SELECT id_professor, nome_professor, telefone, formacao FROM professores WHERE id_professor = $1',
            [id]
        );
        res.render("professores/editar",
            
        {professor: result.rows[0] });
    } catch (erro) {
        console.error("Erro ao abrir edição de professor", erro);
        res.redirect('/professores');
    }
});


//EDITAR(POST)- grava alterações
router.post('/:id/editar', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_professor, telefone, formacao } = req.body;
        await BD.query(
            `UPDATE professores SET nome_professor = $1, 
            telefone = $2, formacao = $3 WHERE id_professor = $4`,
            [nome_professor, telefone, formacao, id]
        );
        res.redirect('/professores');
    } catch (erro) {
        console.error("Erro ao editar professor ", erro);
        res.render('/professores');
    }
});

//DELETAR (POST)
router.post('/:id/deletar', async (req, res) => {
    try {
        const { id } = req.params;
        await BD.query(
            'DELETE FROM professores WHERE id_professor = $1',
            [id]);
        res.redirect('/professores');
    } catch (erro) {
        console.error("Erro ao deletar professor ", erro);
        res.redirect('/professores');
    }   
});

export default router;