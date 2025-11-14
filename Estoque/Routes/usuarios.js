import express from 'express'
import BD from '../db.js'

const router = express.Router()

// ==============================
// LISTAR USUÁRIOS
// ==============================
router.get('/', async (_req, res) => {
    try { 
        const result = await BD.query(
            'SELECT id_usuario, nome, usuario, senha,criado_em, ativo FROM usuarios ORDER BY nome'
        )
        res.render('usuarios/lista', { usuarios: result.rows })
    } catch (erro) {
        console.error('Erro ao listar usuários', erro)
        res.render('usuarios/lista', { usuarios: [], mensagem: 'Erro ao listar usuários' })
    }
})

// ==============================
// FORM CRIAR USUÁRIO
// ==============================
router.get('/novo', (_req, res) => {
    res.render('usuarios/criar', { mensagem: '' })
})

// ==============================
// SALVAR NOVO USUÁRIO
// ==============================
router.post('/novo', async (req, res) => {
    const { nome, usuario, senha } = req.body;

    try {
        await BD.query(
            'INSERT INTO usuarios (nome, usuario, senha) VALUES ($1, $2, $3)',
            [nome, usuario, senha]
        );
        return res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao criar usuário', erro);
        res.render('usuarios/criar', { mensagem: 'Erro ao salvar usuário' });
    }
});


// ==============================
// FORM EDITAR USUÁRIO
// ==============================
router.get('/:id/editar', async (req, res) => {
    const { id } = req.params
    let usuario = null

    try {
        const rUser = await BD.query(
            'SELECT id_usuario, nome, senha FROM usuarios WHERE id_usuario = $1',
            [id]
        )
        usuario = rUser.rows[0]

        if (!usuario) return res.redirect('/usuarios')

        res.render('usuarios/editar', { usuario, mensagem: '' })
    } catch (erro) {
        console.error('Erro ao carregar usuário', erro)
        res.render('usuarios/editar', {
            usuario,
            mensagem: 'Erro ao carregar dados'
        })
    }
})

// ==============================
// SALVAR EDIÇÃO
// ==============================
router.post('/:id/editar', async (req, res) => {
    const { id } = req.params
    const { nome } = req.body

    try {
        await BD.query(
            'UPDATE usuarios SET nome = $1,WHERE id_usuario = $3',
            [nome, id]
        )
        return res.redirect('/usuarios')
    } catch (erro) {
        console.error('Erro ao atualizar usuário', erro)
        res.render('usuarios/editar', {
            usuario: { id_usuario: id, nome },
            mensagem: 'Erro ao atualizar usuário'
        })
    }
})

// ==============================
// DELETAR
// ==============================
router.post('/:id/deletar', async (req, res) => {
    const { id } = req.params

    try {
        await BD.query(
            'DELETE FROM usuarios WHERE id_usuario = $1',
            [id]
        )
        return res.redirect('/usuarios')
    } catch (erro) {
        console.error('Erro ao excluir usuário', erro)
        return res.redirect('/usuarios')
    }
})

export default router
