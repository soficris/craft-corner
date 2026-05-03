const {DataTypes} = require('sequelize'); // carrega a classe DataTypes do sequelize
const sequelize = require('../../config/database'); // importa a configuração do banco de dados

const User = sequelize.define( // define a estrutura da entidade User (tabela users)
    'User', // 1º parametro: nome da entidade
    { // 2º parametro: definição dos campos da tabela
        id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, 
        username:       { type: DataTypes.STRING, allowNull: false, unique: true },
        email:          { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password:       {type: DataTypes.STRING, allowNull: false },
        fullname:       { type: DataTypes.STRING, allowNull: true },
        bio:            { type: DataTypes.STRING(255), allowNull: true },
        profilePicture: { type: DataTypes.STRING, allowNull: true },
        isBlocked:      { type: DataTypes.BOOLEAN, defaultValue: false },
        isAdmin:        { type: DataTypes.BOOLEAN, defaultValue: false }
    }, 
    { // 3º parametro: opções de configuração do modelo
        timestamps: true, // adiciona os campos createdAt e updatedAt
        tableName: 'users', // nome da tabela no banco de dados
    }
); 

module.exports = User; 