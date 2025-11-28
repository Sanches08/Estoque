import express from 'express';
import pool from '../db.js';

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
                m.id_usuario,
            FROM movimentacao_estoque m
            JOIN produto p ON m.id_produto = p.id_produto
            JOIN usuario u ON m.id_usuario = u.id_usuario
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

export default router;
 