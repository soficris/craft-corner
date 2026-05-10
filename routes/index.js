var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController'); 
const authMiddleware = require('../middlewares/auth'); 

// Rota para a página inicial
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Craft Corner' });
});

// Rota para a página de registro
router.get('/register', (req,res) => {
    res.render('register', {title: 'Criar Conta'}); 
}); 

// Rota para processar o formulário de registro
router.post('/register', userController.register); 

router.get('/login', (req,res) => {
    res.render('login', { title: 'Entrar'}); 
}); 

router.post('/login', userController.login); 

router.get('/logout', userController.logout);

router.get('/feed', authMiddleware, (req, res) => {
    res.render('home', { user: req.session.user}); 
}); 

module.exports = router;