const User = require ('./userModel'); 
const bcrypt = require('bcryptjs'); 
const fs = require("fs"); 
const path = require("path"); 

exports.register = async (req, res) => {
    const { username, email, password, confirmPassword, fullName } = req.body;

    try{
        // 1. Validação básica de senhas coincidentes 
        if(password !== confirmPassword){
            req.flash('error', 'As senhas não coincidem'); 
            return res.redirect('/register'); 
        } 

        //2. Verificar se usuário ou email já existem 
        const emailExists = await User.findOne({where: {email}}); 
        const usernameExists = await User.findOne({where: {username}}); 

        if(emailExists || usernameExists){
            req.flash('error', 'Este email ou usuário já está cadastrado');
            return res.redirect('/register'); 

        }

        //3. Hash da senha 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password,salt); 

        //4. Salvar no banco
        await User.create({
            username, 
            email, 
            password: hashedPassword, 
            fullName
        }); 

        //5.Redirecionar para login com mensagem de sucesso
        req.flash('sucess', 'Conta criada com sucesso! Faça seu login'); 
        res.redirect('/login');
    } catch(error){
        console.error(error); 
        req.flash('error', 'Erro ao criar conta. Ferique os dados e tente novamente.'); 
        res.redirect('/register'); 
    }
}; 

exports.login = async (req, res) => {
    try{
        const {login, password} = req.body; 

        //1. Buscar usuário por email ou username
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email: login}, {username: login}]
            }
        }); 

        //2. Verificar se usuário existee se a senha bate 
        if(!user || !(await bcrypt.compare(password, user.password))){
            req.flash('error', 'E-mail/Usuário ou senha incorreta'); 
            return res.redirect('/login'); 
        }

        //3. Criar a sessão do usuário 
        const userData = await this.getProfile(user.id); 
        req.session.user = userData;  

        //4. Redirecionar para o feed 
        res.redirect('/feed'); 

    } catch(error){
        console.error(error); 
        req.flash('error', 'Ocorreu um erro ao tentar entrar. '); 
        res.redirect('/login'); 
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
}; 

exports.getProfile = async (userId) => {
    try{
        const user = await User.findByPk (userId, { attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']}); 
        return user; 
    } catch (error){
        console.error(error); 
        throw new Error('Erro ao buscar perfil do usuário'); 
    }
};

exports.updateProfile = async (req, res) => {
    try{
        const { fullName, bio } = req.body; 
        const userId = req.session.user.id; 

        const updateData = { fullName, bio }; 

        if(req.file) {
            updateData.profilePicture = req.file.filename; 
        }
        //obtem o nome da foto antiga antes de atualizar 
        const oldUser = await User.findByPk(userId); 

        await User.update(updateData, { where: { id: userId}}); 
        //atualiza os dados do usuario na sessao para refletir as mudanças imediatamente

        if(req.file && oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png'){
            const oldProfilePicPath = path.join(__dirname, '../../public/uploads/profiles', oldUser.profilePicture); 
            fs.unlink(oldProfilePicPath, (err) => {
                if(err) console.error('Erro ao apagar foto de perfil antiga:', err); 
                else console.log('Foto de perfil antiga apagada:', oldProfilePicPath); 
            }); 
        }

        const userData = await this.getProfile(userId); 
        req.session.user = userData;  

        req.flash('sucess', 'Perfil atualizado com sucesso!'); 
        res.redirect('/profile/edit'); 
    } catch (error) {
        console.error(error); 
        req.flash('error', 'Erro ao atualizar perfil.'); 
        res.redirect('/profile/edit');
    }
};