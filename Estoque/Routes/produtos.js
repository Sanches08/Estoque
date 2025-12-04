import express from 'express';
import db from '../db.js';
const router = express.Router();

// Rota para listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await db.query('SELECT * FROM PRODUTO');
        res.render('produtos/lista', { produtos: produtos.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao listar produtos');
    }
});

// Rota para exibir o formulário de criação de produto
router.get('/criar', async (req, res) => {
    try {
        const categorias = await db.query(`SELECT id_categoria, nome_categoria FROM categoria ORDER BY nome_categoria ASC`)
        res.render('produtos/criar', { categorias: categorias.rows, mensagem: '' })
    } catch (e) {
        console.error('Erro ao carregar turmas', e)
        res.render('produtos/criar', { categorias: [], mensagem: 'Erro ao carregar categorias' })
    }
});

// Rota para processar a criação de um novo produto
router.post('/criar', async (req, res) => {
    const { nome_produto, descricao, quant_estoque, estoque_minimo, valor, ativo, id_categoria } = req.body;
    const data_cadastro = new Date(); // Data atual
    console.log(req.body);
    try {
            await db.query(
                'INSERT INTO PRODUTO (nome_produto, descricao, quant_estoque, estoque_minimo, data_cadastro, valor, ativo, id_categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
                [nome_produto, descricao, quant_estoque, estoque_minimo, data_cadastro, valor, ativo === 'on' ? 1 : 0, id_categoria]
            );
        res.redirect('/produtos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar produto');
    }
});

// Rota para exibir o formulário de edição de produto
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // CORRIGIDO: Trocado 'produtos' por 'PRODUTO'
        const produto = await db.query('SELECT * FROM PRODUTO WHERE id_produto = $1', [id]);
        const categorias = await db.query(`SELECT id_categoria, nome_categoria FROM categoria ORDER BY nome_categoria ASC`);
        if (produto.rows.length > 0) {
            res.render('produtos/editar', { produto: produto.rows[0], categorias: categorias.rows, mensagem: '' });
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar produto para edição');
    }
});

// Rota para processar a atualização de um produto
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_produto, descricao, quant_estoque, estoque_minimo, valor, ativo, id_categoria } = req.body;

    try {
        // CORRIGIDO: Trocado 'produtos' por 'PRODUTO'
        await db.query(
            'UPDATE PRODUTO SET nome_produto = $1, descricao = $2, quant_estoque = $3, estoque_minimo = $4, valor = $5, ativo = $6, id_categoria = $7 WHERE id_produto = $8',
            [nome_produto, descricao, quant_estoque, estoque_minimo, valor, ativo === 'on' ? 1 : 0, id_categoria, id]
        );
        res.redirect('/produtos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar produto');
    }
});

// Rota para deletar um produto
router.post('/deletar/:id', async (req, res) => {
    const { id } = req.params

    try {
        await db.query(
            'DELETE FROM PRODUTO WHERE id_produto = $1',
            [id]
        )
        return res.redirect('/produtos')
    } catch (erro) {
        console.error('Erro ao deletar produto', erro)
        return res.redirect('/produtos')
    }
});

export default router;