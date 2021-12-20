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
app.get('/seuspedidos', function(request,response){
    response.render('seuspedidos');
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
app.get('/seuspedidos/:user', function(request,response){
    response.render('seuspedidos');
});

// port
app.listen(3000);

function send() {
    let getName = document.querySelector('#boxName').value
    let getEmail = document.querySelector('#boxEmail')
    let getPassword = document.querySelector('#boxPassword').value
    let getConfirmPassword = document.querySelector('#boxConfirmPassword').value
    
    let regexnome = /\d+/
    let regexsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if(regexnome.test(getName) == true || getName === ""){

        alert('Nome não pode conter letras e o campo não pode ser vazio, tente novamente')
    }

    if (regexsenha.test(getPassword) == false){

        alert('A senha deve possuir letras e numeros, a senha não pode ser vazia e não pode ter menos que 8 caracteres')

    }

    if (getPassword != getConfirmPassword){

        alert('As senhas devem ser iguais')

    }

}
