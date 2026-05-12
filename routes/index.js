var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController'); 
const authMiddleware = require('../middlewares/auth'); 
const upload = require('../middlewares/multer'); 

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

router.get('/feed', authMiddleware, async (req, res) => {
    const user = await userController.getProfile(req.session.user.id); 
    res.render('home', { user }); 
}); 

router.get('/profile/edit', authMiddleware, async (req, res) => {
    const user = await userController.getProfile(req.session.user.id); 
    res.render('edit-profile', { user}); 
}); 

router.post('/profile/edit', authMiddleware, upload.single('profilePicture'), userController.updateProfile);

module.exports = router;