const {Sequelize} = require('sequelize'); //carreg a classe Sequelize do módulo sequelize 
require('dotenv').config(); //carrega as variáveis de ambiente do arquivo .env

const sequelize = new Sequelize(
    process.env.DB_NAME, //nome do banco de dados 
    process.env.DB_USER, //usuário do banco de dados
    process.env.DB_PASSWORD, //senha do banco de dados
    {
        host: process.env.DB_HOST,               //host do banco de dados
        port: process.env.DB_PORT,              //porta do banco de dados
        dialect: 'mysql',                      //dialeto do banco de dados
        logging: false,                       //desativa os logs de SQL no console
        define: {
            timestamps: true,              //adiciona os campos createdAt e updatedAt nas tabelas
            underscored: true,            //usa snake_case para os nomes dos campos no banco de dados
        }
    }
); 

module.exports = sequelize; 