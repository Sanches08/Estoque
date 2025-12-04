// Importa o módulo Express para usar as rotas
import express from 'express';
import db from '../db.js';
//Cria um objeto 'router que organiza as rotas
const router = express.Router();
//---------------------------------------------------------------------------------------------------------------------------

//Define a rota principal da área administrativa
//Quando o usuário acessar http://localhost:3000/admin, 
//o servidor vai renderizar abrir o arquivo 'views/admin/dashboard.ejs'
router.get('/', async (req, res) => {
    try {
        const usuario = req.session.usuarioLogado;
        const TotalProdutosResult = await db.query('SELECT COUNT(*) FROM PRODUTO');
        const TotalestoqueCriticoResult = await db.query('SELECT COUNT(*) FROM PRODUTO WHERE quant_estoque <= estoque_minimo');
        const usuariosativos = await db.query('SELECT COUNT(*) FROM USUARIO WHERE ativo = true');
        const produtosLegendas = await db.query('SELECT nome_produto, estoque_minimo, quant_estoque FROM produto ORDER BY nome_produto ASC');

        res.render('admin/dashboard', {
            titulo: 'Dashboard',
            TotalProdutosResult: TotalProdutosResult.rows[0].count,
            TotalestoqueCriticoResult: TotalestoqueCriticoResult.rows[0].count,
            usuariosativos: usuariosativos.rows[0].count,
            produtosLegendas: produtosLegendas.rows,
            nomeUsuario: usuario
        });
    } catch (erro) {
        console.log(erro);
        res.render('admin/dashboard', { mensagem: 'Erro ao carregar o dashboard.' });
    }
});
    

export default router