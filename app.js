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
var root = false;

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
// get and post
app.get('/', function(request,response){ 
    if(user.id != null){
        response.redirect('/' + user.nome);
    }
    response.render('index', { nome: user.nome, online: online, root: root});
});
app.get('/entrar', function(request,response){
    if(user.id != null){
        response.redirect('/entrar/' + user.nome);
    }
    response.render('entrar', { nome: user.nome, online: online, root: root });
});
app.get('/registrar', function(request,response){
    if(user.id != null){
        response.redirect('/registrar' + user.nome);
    }
    response.render('registrar', { nome: user.nome, online: online, root: root });
});
app.get('/doces', function(request,response){
    if(user.id != null){
        response.redirect('/doces/' + user.nome);
    }
    response.render('doces', { nome: user.nome, online: online, root: root});
});
app.get('/salgados', function(request,response){
    if(user.id != null){
        response.redirect('/salgados/' + user.nome);
    }
    response.render('salgados', { nome: user.nome, online: online, root: root});
});
app.get('/pedidos', function(request,response){
    if(user.id != null){
        response.redirect('/pedidos/' + user.nome);
    }
    response.render('pedidos', { nome: user.nome, online: online, root: root});
});
app.get('/tabela-nutricional', function(request,response){
    if(user.id != null){
        response.redirect('/tabela-nutricional/' + user.nome);
    }
    response.render('tbnutri', { nome: user.nome, online: online, root: root });
});
app.get('/seuspedidos', function(request,response){
    response.redirect('/seuspedidos/' + user.nome);
});
app.get('/todosospedidos', function(request,response){
    response.redirect('/todosospedidos/' + user.nome);
});
app.get('/usuario', function(request,response){
    response.render('usuario', { nome: user.nome, online: online, root: root });
});
app.post('/registrar', function(request, response){
    if(!send(request.body.nome,request.body.email,request.body.senha, request.body.confirmsenha)){
                response.render('registrar',{nome: user.nome, online: online  ,msg: 'Não fui possível fazer o registro da conta: as senhas precisam ser iguais', root: root});
    }
    Usuarios.findOne({ where: { email: request.body.email }}).then(function(user){
            if(user != null){        
                response.render('registrar',{nome: user.nome, online: online  ,msg: 'Não fui possível fazer o registro da conta: o e-mail fornecido já está em uso', root: root});
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
        response.render('registrar',{nome: user.nome, online: online , msg: 'Registro feito com sucesso', root: root});
    }).catch(function(){
        response.render('registrar',{nome: user.nome, online: online ,msg: 'Não fui possível fazer o registro da conta', root: root});
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
            online: online,
            root: root 
        });
    }).catch(function(){
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Não foi possível realizar o pedido',
            msg2: 'Tente novamente mais tarde', 
            online: online,
            root: root
        });
    });
});
app.post('/entrar/', function(request,response){
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
        if(user.id == 1 ){
            root = true;
        }
        console.log(root);
        response.redirect('/' + user.nome);        
    }).catch(function(){
        response.render('entrar', { nome: user.nome, online: online ,msg: 'E-mail ou senhas incorretos' , root: root });
    });

});
app.get('/sair/', function(request, response){
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
    root = false;
    response.redirect('/entrar');
});

// user variables
app.get('/:user', function(request,response){
    response.render('index', { nome: user.nome, online: online, root: root });
});
app.get('/doces/:user', function(request,response){
    response.render('doces', { nome: user.nome, online: online, root: root });
});
app.get('/salgados/:user', function(request,response){
    response.render('salgados', { nome: user.nome, online: online, root: root });
});
app.get('/pedidos/:user', function(request,response){
    response.render('pedidos', { nome: user.nome, online: online, root: root });
});
app.get('/tabela-nutricional/:user', function(request,response){
    response.render('tbnutri', { nome: user.nome, online: online, root: root });
});
app.get('/seuspedidos/:user', function(request,response){
    Pedidos.findAll({
        where: {
            email: user.email
        }
    }).then(function(pedidos){
        console.log(pedidos);
        response.render('seuspedidos', { pedidos: pedidos, nome: user.nome, online: online, root: root });
    }).catch();
}
);
app.get('/todosospedidos/:user', function(request,response){
    Pedidos.findAll().then(function(pedidos){
        console.log(pedidos);
        response.render('todosospedidos', { pedidos: pedidos, nome: user.nome, online: online, root: root });
    }).catch();
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

// port
app.listen(3000);

