const db = require('./db');
db.sequelize.authenticate().then(function(){
    console.log('Conectado com sucesso!');
}).catch(function(error){
    console.log('Falha ao se conectar: ' + error);
});
// Tabela de usuários
const Usuarios = db.sequelize.define('usuarios', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    cep: {
        type: db.Sequelize.STRING
    },
    logradouro: {
        type: db.Sequelize.STRING
    },
    numeroLogradouro: {
        type: db.Sequelize.STRING
    },
    complementoLogradouro: {
        type: db.Sequelize.TEXT
    },
    cidade: {
        type: db.Sequelize.STRING
    },
    estado: {
        type: db.Sequelize.STRING
    },
    adm: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
});

Usuarios.sync({ alter: true });

module.exports = Usuarios;