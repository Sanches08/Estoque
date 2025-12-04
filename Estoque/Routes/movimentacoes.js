import express from 'express';
import BD from '../db.js';

const router = express.Router();

router.get('/', async (_req, res) => {
    try { 
        const result = await BD.query(
            `SELECT 
                m.id_movimento,
                m.tipo_movimento,
                m.quant_movimentada,
                m.dat,
                m.descricao,
                m.id_produto,
                u.nome AS nome_usuario
            FROM movimentacao_estoque m
            left JOIN produto p ON m.id_produto = p.id_produto
            left JOIN usuario u ON m.id_usuario = u.id_usuario
            ORDER BY m.dat DESC`
        );
        
        res.render('movimentacoes/lista', { movimentacoes: result.rows })
         
    } catch (erro) {
        console.error('Erro ao listar movimentações:', erro)
        res.render('movimentacoes/lista', { 
            movimentacoes: [], 
            mensagem: 'Erro ao carregar o histórico de movimentações.' 
        })
    }
});


router.get('/criar', async (req, res) => {
    try {
        // Carrega produtos e usuários para seleção no formulário
        const produtos = await BD.query(`SELECT id_produto, nome_produto FROM produto ORDER BY nome_produto ASC`);
        const usuarios = await BD.query(`SELECT id_usuario, nome FROM usuario ORDER BY nome ASC`);

        res.render('movimentacoes/criar', { 
            produtos: produtos.rows, 
            usuarios: usuarios.rows, 
            mensagem: '' 
        });

    } catch (e) {
        console.error('Erro ao carregar dados', e);
        res.render('movimentacoes/criar', { produtos: [], usuarios: [], mensagem: 'Erro ao carregar dados' });
    }
});


// ========================================
// ROTA: Criar nova movimentação
// ========================================
router.post('/criar', async (req, res) => {
    const { tipo_movimento, quant_movimentada, dat, descricao, id_produto, id_usuario } = req.body;

    try {
        await BD.query(
            `INSERT INTO movimentacao_estoque 
                (tipo_movimento, quant_movimentada, dat, descricao, id_produto, id_usuario)
             VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [tipo_movimento, quant_movimentada, dat, descricao, id_produto, id_usuario]
        );

        res.redirect('/movimentacoes'); 

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar movimentação');
    }
});


// ========================================
// ROTA: Formulário de edição
// ========================================
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const movimento = await BD.query(
            `SELECT * FROM movimentacao_estoque WHERE id_movimento = $1`,
            [id]
        );

        const produtos = await BD.query(`SELECT id_produto, nome_produto FROM produto ORDER BY nome_produto ASC`);
        const usuarios = await BD.query(`SELECT id_usuario, nome FROM usuario ORDER BY nome ASC`);

        if (movimento.rows.length > 0) {
            res.render('movimentacoes/editar', { 
                movimento: movimento.rows[0], 
                produtos: produtos.rows,
                usuarios: usuarios.rows,
                mensagem: '' 
            });

        } else {
            res.status(404).send('Movimentação não encontrada');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar movimentação');
    }
});


// ========================================
// ROTA: Atualizar movimentação
// ========================================
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_movimento, quant_movimentada, dat, descricao, id_produto, id_usuario } = req.body;

    try {
        await BD.query(
            `UPDATE movimentacao_estoque 
                SET tipo_movimento = $1, quant_movimentada = $2, dat = $3, descricao = $4, 
                    id_produto = $5, id_usuario = $6
             WHERE id_movimento = $7`,
            [tipo_movimento, quant_movimentada, dat, descricao, id_produto, id_usuario, id]
        );

        res.redirect('/movimentacoes');

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar movimentação');
    }
});


// ========================================
// ROTA: Deletar movimentação
// ========================================
router.post('/deletar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await BD.query(
            `DELETE FROM movimentacao_estoque WHERE id_movimento = $1`,
            [id]
        );

        res.redirect('/movimentacoes');

    } catch (err) {
        console.error('Erro ao deletar movimentação', err);
        res.redirect('/movimentacoes');
    }
});


export default router;