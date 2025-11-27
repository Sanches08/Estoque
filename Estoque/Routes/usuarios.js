import express from 'express'
import BD from '../db.js'

const router = express.Router()

// ==============================
// LISTAR USUÁRIOS
// ==============================
router.get('/', async (_req, res) => {
    try { 
        const result = await BD.query(
            'SELECT id_usuario, nome, usuario, senha,criado_em, ativo FROM usuario ORDER BY nome'
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
    // CORRIGIDO: Agora extrai 'nome', 'usuario', 'senha' e 'ativo'
    const { nome, usuario, senha, ativo } = req.body; 

    // Converte o checkbox 'ativo' para booleano. Se não for enviado, é false.
    const isAtivo = ativo === 'true' || ativo === 'on' ? true : false;
    
    // Objeto para re-renderizar o formulário em caso de erro
    const novoUsuario = { nome, usuario, ativo: isAtivo };

    try {
        await BD.query(
            // SQL: Agora insere 'ativo' também
            'INSERT INTO usuario (nome, usuario, senha, ativo) VALUES ($1, $2, $3, $4)',
            [nome, usuario, senha, isAtivo]
        );
        return res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao criar usuário', erro);
        // Passa os dados submetidos para o EJS
        res.render('usuarios/criar', { 
            mensagem: 'Erro ao salvar usuário. Verifique os dados.',
            usuario: novoUsuario 
        });
    }
});


// ==============================
// FORM EDITAR USUÁRIO
// ==============================
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params
    let usuario = null

    try {
        const rUser = await BD.query(
            'SELECT id_usuario, nome, senha, ativo, criado_em FROM usuario WHERE id_usuario = $1',
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

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params
    const { nome, usuario, senha, ativo } = req.body

    // Converte checkbox 'ativo' para booleano (true se marcado, false se não)
    const isAtivo = ativo === 'true' || ativo === 'on' ? true : false

    // Inicializa Query com campos obrigatórios
    let query = 'UPDATE usuario SET nome = $1, usuario = $2, ativo = $3'
    // id sempre deve ser o ÚLTIMO parâmetro.
    const params = [nome, usuario, isAtivo, id] 

    // 1. Lógica para Senha (Se for fornecida): 
    // OBS: Esta lógica salva a senha em texto puro. Recomenda-se usar hash (ex: bcrypt).
    if (senha && senha.length > 0) {
        // Insere a senha no 4º slot dos parâmetros (antes do ID)
        params.splice(3, 0, senha); 
        // Adiciona a coluna senha à Query
        query += ', senha = $4'; 
    }

    // Finaliza a Query: A posição do ID ($N) na condição WHERE é sempre o tamanho atual do array params
    query += ' WHERE id_usuario = $' + params.length 

    // Cria objeto temporário para re-renderização em caso de erro
    let usuarioAtual = { id_usuario: id, nome, usuario, ativo: isAtivo } 

    try {
        await BD.query(query, params)
        return res.redirect('/usuarios')
    } catch (erro) {
        console.error('Erro ao atualizar usuário', erro)
        
        // Em caso de erro, tenta buscar 'criado_em' do DB para renderizar a página corretamente
        try {
            const rUser = await BD.query('SELECT criado_em FROM usuario WHERE id_usuario = $1', [id]);
            if (rUser.rows.length > 0) {
                usuarioAtual.criado_em = rUser.rows[0].criado_em;
            }
        } catch (e) {
            // Ignora erro de busca secundária
        }

        res.render('usuarios/editar', {
            usuario: usuarioAtual,
            mensagem: 'Erro ao atualizar usuário' 
        })
    }
})

// ==============================
// DELETAR
// ==============================
router.post('/deletar/:id', async (req, res) => {
    const { id } = req.params

    try {
        await BD.query(
            'DELETE FROM usuario WHERE id_usuario = $1',
            [id]
        )
        return res.redirect('/usuarios')
    } catch (erro) {
        console.error('Erro ao excluir usuário', erro)
        return res.redirect('/usuarios')
    }
})

export default router
