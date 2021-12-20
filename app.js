// express
var express = require('express');
var app = express();

// handlebars
var { engine } = require('express-handlebars');

// body-parser
var bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

// sequelize
const Usuarios = require('./models/Usuarios');
const Pedidos = require('./models/Pedidos');
const req = require('express/lib/request');
const { redirect } = require('express/lib/response');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Usuário root
Usuarios.findAll({
    attributes: [
        'nome',
        'email'
    ], 
    where: {
        id: 1
    }
}).then(function(usuarios){
    Usuarios.update({
        nome: 'root',
        email: 'root',
        senha: 'root',
        adm: true
    },
    {
        where:{
            id: 1
        }
    });
}).catch(function(){
    Usuarios.create({
        nome: 'root',
        email: 'root',
        senha: 'root',
        adm: true
    });
});

// Variáveis globais
var user = {
    nome: null,
    email: null,
    senha: null,
    cep: null,
    logradouro: null,
    numeroLogradouro: null,
    complementoLogradouro: null,
    cidade: null,
    estado: null
}

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
// get and post
app.get('/', function(request,response){
    response.render('index', {msg : msg});
});
app.get('/entrar', function(request,response){
    response.render('entrar');
});
app.get('/registrar', function(request,response){
    response.render('registrar');
});
app.get('/doces', function(request,response){
    response.render('doces');
});
app.get('/salgados', function(request,response){
    response.render('salgados');
});
app.get('/pedidos', function(request,response){
    response.render('pedidos');
});
app.get('/tabela-nutricional', function(request,response){
    response.render('tbnutri');
});

app.post('/registrar', function(request, response){
    Usuarios.create({
        nome: request.body.nome,
        email: request.body.email,
        senha: request.body.senha,
        cep: request.body.cep,
        logradouro: request.body.address,
        numeroLogradouro: request.body.numaddress,
        complementoLogradouro: request.body.comp,
        cidade: request.body.cidade,
        estado: request.body.estado        
    }).then(function(){

        response.render('registrar',{ msg: 'Registro feito com sucesso'});
    }).catch(function(){
        response.render('registrar',{msg: 'Não fui possível fazer o registro da conta'});
    });
});
app.post('/pedidos', function(request, response){
    Pedidos.create({
        nome: request.body.nome,
        email: request.body.email,
        cep: request.body.cep,
        logradouro: request.body.address,
        numeroLogradouro: request.body.numaddress,
        complementoLogradouro: request.body.comp,
        cidade: request.body.cidade,
        estado: request.body.estado,
        produtos: request.body.orders,
        complementoProdutos: request.body.comporder
    }).then(function(){
        response.render('pedidos', {
            msg: 'Pedido feito com sucesso'
        });
    }).catch(function(){
        response.render('pedidos', {
            msg: 'Não foi possível realizar o pedido',
            msg2: 'Tente novamente mais tarde'
        });
    });
});
app.post('/entrar', function(request,response){
    
});

// user variables
app.get('/:user', function(request,response){
    response.render('index');
});
app.get('/doces/:user', function(request,response){
    response.render('doces');
});
app.get('/salgados/:user', function(request,response){
    response.render('salgados');
});
app.get('/pedidos/:user', function(request,response){
    response.render('pedidos');
});
app.get('/tabela-nutricional/:user', function(request,response){
    response.render('tbnutri');
});

// port
app.listen(3000);