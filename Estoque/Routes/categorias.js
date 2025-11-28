import express from 'express'
import BD from '../db.js'

const router = express.Router()

// ==============================
// 1. LISTAR CATEGORIAS (GET /categorias)
// ==============================
router.get('/', async (_req, res) => {
    try { 
        const result = await BD.query(
            'SELECT id_categoria, nome_categoria FROM categoria ORDER BY nome_categoria ASC'
        )
        
        res.render('categorias/lista', { 
            categorias: result.rows,
            mensagem: ''
        })
        
    } catch (erro) {
        console.error('Erro ao listar categorias:', erro)
        res.render('categorias/lista', { 
            categorias: [], 
            mensagem: 'Erro ao carregar a lista de categorias.' 
        })
    }
})

// ==============================
// 2. FORMULÁRIO CRIAR CATEGORIA (GET /categorias/novo)
// ==============================
router.get('/novo', (_req, res) => {
    // Renderiza o formulário de criação (views/categorias/criar.ejs)
    res.render('categorias/criar', { 
        mensagem: '',
        categoria: {} // Objeto vazio para evitar erro de referência no EJS
    })
})

// ==============================
// 3. SALVAR NOVA CATEGORIA (POST /categorias/novo)
// ==============================
router.post('/novo', async (req, res) => {
    const { nome_categoria } = req.body;
    
    try {
        await BD.query(
            'INSERT INTO categoria (nome_categoria) VALUES ($1)',
            [nome_categoria]
        );
        return res.redirect('/categorias');
    } catch (erro) {
        console.error('Erro ao criar categoria:', erro);
        res.render('categorias/criar', { 
            mensagem: 'Erro ao salvar categoria. Verifique se o nome já existe.',
            categoria: { nome_categoria } // Retorna o nome digitado para preencher o campo
        });
    }
});

// ==============================
// 4. FORMULÁRIO EDITAR CATEGORIA (GET /categorias/editar/:id)
// ==============================
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await BD.query(
            'SELECT id_categoria, nome_categoria FROM categoria WHERE id_categoria = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.redirect('/categorias');
        }

        // Renderiza o formulário de edição (views/categorias/editar.ejs)
        res.render('categorias/editar', { 
            categoria: result.rows[0],
            mensagem: ''
        });

    } catch (erro) {
        console.error('Erro ao carregar categoria para edição:', erro);
        return res.redirect('/categorias');
    }
});

// ==============================
// 5. ATUALIZAR CATEGORIA (POST /categorias/editar/:id)
// ==============================
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_categoria } = req.body;

    try {
        await BD.query(
            'UPDATE categoria SET nome_categoria = $1 WHERE id_categoria = $2',
            [nome_categoria, id]
        );
        console.log(`[ATUALIZAR POST] Novo Nome (req.body.nome_categoria): "${nome_categoria}"`);
        return res.redirect('/categorias');
        

    } catch (erro) {
        console.error('Erro ao atualizar categoria:', erro);
        // Em caso de erro, tenta re-renderizar a página de edição
        res.render('categorias/editar', {
            categoria: { id_categoria: id_categoria, nome_categoria: nome_categoria },
            mensagem: 'Erro ao atualizar categoria. Nome pode já estar em uso.'
        });
    }
});

// ==============================
// 6. DELETAR CATEGORIA (POST /categorias/deletar/:id)
// ==============================
router.post('/deletar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // ATENÇÃO: Verifique se não há produtos ou outras tabelas referenciando esta categoria
        await BD.query('DELETE FROM categoria WHERE id_categoria = $1', [id]);
        return res.redirect('/categorias');

    } catch (erro) {
        console.error('Erro ao deletar categoria:', erro);
        // Redireciona com um parâmetro de query ou trata a mensagem na listagem
        return res.redirect('/categorias?erro=nao_deletado');
    }
});

export default router