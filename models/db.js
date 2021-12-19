// sequelize
const Sequelize = require('sequelize');
// new Sequelize(banco de dados, login, senha)
// É necessário criar banco de dados >> usersdciacat
const sequelize = new Sequelize('usersdciacat', '', '',{
    host: 'localhost',
    dialect: 'mysql'
}); 

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
