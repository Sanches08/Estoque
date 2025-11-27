import express from 'express'
import BD from '../db.js'

const router = express.Router()

// ==============================
// LISTAR MOVIMENTAÇÕES
// Rota: /movimentacoes
// ==============================
router.get('/', async (_req, res) => {
    try { 
        // SQL: Seleciona Movimentações e faz JOIN para trazer nomes de Produto e Usuário
        const result = await BD.query(
            `SELECT 
                m.id_movimento,
                m.tipo_movimento,
                m.quant_movimentada,
                m.dat,
                m.descricao,
                p.nome AS nome_produto,
                u.nome AS nome_usuario
            FROM 
                movimentacao m
            JOIN 
                produto p ON m.id_produto = p.id_produto
            JOIN 
                usuario u ON m.id_usuario = u.id_usuario
            ORDER BY 
                m.dat DESC` // Ordena pela data mais recente
        )
        
        // Renderiza a lista usando o novo arquivo EJS
        res.render('movimentacoes/lista', { movimentacoes: result.rows })
        
    } catch (erro) {
        console.error('Erro ao listar movimentações:', erro)
        res.render('movimentacoes/lista', { 
            movimentacoes: [], 
            mensagem: 'Erro ao carregar o histórico de movimentações.' 
        })
    }
})

export default router