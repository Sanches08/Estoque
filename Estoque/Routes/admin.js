// Importa o módulo Express para usar as rotas
import express from 'express';
//Cria um objeto 'router que organiza as rotas
const router = express.Router();
//---------------------------------------------------------------------------------------------------------------------------

//Define a rota principal da área administrativa
//Quando o usuário acessar http://localhost:3000/admin, 
//o servidor vai renderizar abrir o arquivo 'views/admin/dashboard.ejs'
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

export default router