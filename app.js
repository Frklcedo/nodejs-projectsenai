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
    id: null,
    nome: '',
    email: '',
    senha: '',
    cep: '',
    logradouro: '',
    numeroLogradouro: '',
    complementoLogradouro: '',
    cidade: '',
    estado: ''
}
var online = false;

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
// get and post
app.get('/', function(request,response){
    response.render('index', { nome: user.nome, online: online  });
});
app.get('/entrar', function(request,response){
    response.render('entrar', { nome: user.nome, online: online  });
});
app.get('/registrar', function(request,response){
    response.render('registrar', { nome: user.nome, online: online  });
});
app.get('/doces', function(request,response){
    response.render('doces', { nome: user.nome, online: online  });
});
app.get('/salgados', function(request,response){
    response.render('salgados', { nome: user.nome, online: online  });
});
app.get('/pedidos', function(request,response){
    response.render('pedidos', { nome: user.nome, online: online  });
});
app.get('/tabela-nutricional', function(request,response){
    response.render('tbnutri', { nome: user.nome, online: online  });
});
app.get('/seuspedidos', function(request,response){
    response.render('seuspedidos', { nome: user.nome, online: online  });
});

app.post('/registrar', function(request, response){
    if(!send(request.body.nome,request.body.email,request.body.senha, request.body.confirmsenha)){
                response.render('registrar',{nome: user.nome, online: online  ,msg: 'Não fui possível fazer o registro da conta: as senhas precisam ser iguais'});
    }
    Usuarios.findOne({ where: { email: request.body.email }}).then(function(user){
            if(user != null){        
                response.render('registrar',{nome: user.nome, online: online  ,msg: 'Não fui possível fazer o registro da conta: o e-mail fornecido já está em uso'});
            }
    }).catch();
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
        response.render('registrar',{nome: user.nome, online: online , msg: 'Registro feito com sucesso'});
    }).catch(function(){
        response.render('registrar',{nome: user.nome, online: online ,msg: 'Não fui possível fazer o registro da conta'});
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
            nome: user.nome ,
            msg: 'Pedido feito com sucesso',
            online: online 
        });
    }).catch(function(){
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Não foi possível realizar o pedido',
            msg2: 'Tente novamente mais tarde', 
            online: online 
        });
    });
});
app.post('/entrar', function(request,response){
    Usuarios.findOne({ where: { 
        email: request.body.email,
        senha: request.body.senha
    }}).then(function(usuario){
        user = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            cep: usuario.cep,
            logradouro: usuario.logradouro,
            numeroLogradouro: usuario.numeroLogradouro,
            complementoLogradouro: usuario.complementoLogradouro,
            cidade: usuario.cidade,
            estado: usuario.estado
        }
        online = true;
        response.redirect('/' + user.nome);        
    }).catch(function(){
        response.render('entrar', { nome: user.nome, online: online ,msg: 'E-mail ou senhas incorretos'});
    });

});
app.get('/sair/:user', function(request, response){
    user = {
        id: null,
        nome: '',
        email: '',
        senha: '',
        cep: '',
        logradouro: '',
        numeroLogradouro: '',
        complementoLogradouro: '',
        cidade: '',
        estado: ''
    }
    online = false;
    response.redirect('/');
});

// user variables
app.get('/:user', function(request,response){
    response.render('index', { nome: user.nome, online: online  });
});
app.get('/doces/:user', function(request,response){
    response.render('doces', { nome: user.nome, online: online });
});
app.get('/salgados/:user', function(request,response){
    response.render('salgados', { nome: user.nome, online: online  });
});
app.get('/pedidos/:user', function(request,response){
    response.render('pedidos', { nome: user.nome, online: online  });
});
app.get('/tabela-nutricional/:user', function(request,response){
    response.render('tbnutri', { nome: user.nome, online: online  });
});
app.get('/seuspedidos/:user', function(request,response){
    Pedidos.findAll({
        where: {
            email: user.email
        }
    }).then(function(pedidos){
        response.render('seuspedidos', { pedidos: pedidos, nome: user.nome, online: online });
    });
    response.render('seuspedidos', { pedidos: pedidos, nome: user.nome, online: online });
}
);

function send(n,e,p,pp) {
    let getName = n
    let getEmail = e
    let getPassword = p
    let getConfirmPassword = pp
    let wrong = true;

    let regexnome = /\d+/
    let regexsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if(regexnome.test(getName) == true || getName === ""){

        wrong = false;

    }

    if (regexsenha.test(getPassword) == false){

        wrong = false;
    }

    if (getPassword != getConfirmPassword){

        wrong = false;

    }

    return wrong;

}

function path() {

    if(user.nome == ''){

        return '/';

    }else{

        return '/' + user.nome;
    }

}

// port
app.listen(3000);

