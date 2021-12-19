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
        email: 'deliciacatessen_root@dlciacat.com',
        senha: 'Rroot.123',
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
        email: 'deliciacatessen_root@dlciacat.com',
        senha: 'Rroot.123',
        adm: true
    });
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
// get and post
app.get('/', function(request,response){
    response.render('index');
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