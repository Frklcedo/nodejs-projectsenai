const db = require('./db');

// Tabela de pedidos
const Pedidos = db.sequelize.define('pedidos', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    cep: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    logradouro: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    numeroLogradouro: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    complementoLogradouro: {
        type: db.Sequelize.TEXT
    },
    cidade: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    estado: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    produtos: {
        type: db.Sequelize.TEXT,
        allowNull: false
    },    
    complementoProdutos: {
        type: db.Sequelize.TEXT
    } 
});

Pedidos.sync({ alter: true });

module.exports = Pedidos;