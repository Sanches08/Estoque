import express from 'express';
import session from 'express-session';

import path from 'path';

import { fileURLToPath } from 'url';

import adminRotas from'./Routes/admin.js';
import loginRotas from './Routes/login.js';
import usuariosRotas from './Routes/usuarios.js'
import movimentacoesRouter from './Routes/movimentacoes.js'

const __fillname=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__fillname);

const app=express();

app.set('views',path.join(__dirname, 'views'));

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.get('/',(req,res)=>res.render('Landing/index'));

app.use(
    session({
        secret: "sesisenai",
        resave: false,
        saveUninitialized:false,
    })
);

const verificarAutenticacao = (req, res, next) => {
    if (req.session.autenticado) {
        res.locals.usuarioLogado = req.session.usuarioLogado;
        res.locals.nomeUsuario = req.session.nomeUsuario;
        res.locals.idUsuario = req.session.idUsuario;
        res.locals.administrador = req.session.administrador;
        next();
    } else {
        res.redirect("/auth/login");
    }
}
app.use('/auth', loginRotas);
app.use('/admin', verificarAutenticacao, adminRotas);
app.use('/usuarios', verificarAutenticacao, usuariosRotas);
app.use('/movimentacoes', movimentacoesRouter) 



app.listen(3002,()=>
console.log('servidor rodando em http://localhost:3002')
)