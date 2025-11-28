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

        res.render('admin/dashboard', {
            titulo: 'Dashboard',
            
            nomeUsuario: usuario
        });
    } catch (erro) {
        console.log(erro);
        res.render('admin/dashboard', { mensagem: 'Erro ao carregar o dashboard.' });
    }
});
    

export default router