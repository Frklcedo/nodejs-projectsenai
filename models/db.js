// sequelize
const Sequelize = require('sequelize');
// new Sequelize(banco de dados, login, senha)
// É necessário criar banco de dados >> usersdciacat
const sequelize = new Sequelize('usersdciacat', 'root', 'Kf082027!',{
    host: 'localhost',
    dialect: 'mysql'
})/*then(function(){
    console.log('Conexão estabelecida!')
}).catch(function(erro){
    console.log('Não foi possível se conectar:'+erro)
});*/ 

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
