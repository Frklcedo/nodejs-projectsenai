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
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',usuarios);
    if(usuarios.length == 0){
        Usuarios.create({
            nome: 'root',
            email: 'root',
            senha: 'root',
            adm: true
        });
    }
    else{
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
    }
}).catch(function(){
    
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
var msg = '';

app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
// get and post
app.get('/', function(request,response){ 
    msg: '';
    if(user.id != null){
        response.redirect('/' + user.nome);
    }
    response.render('index', { nome: user.nome, online: online, root: root});
});
app.get('/entrar', function(request,response){
    msg: '';
    if(user.id != null){
        response.redirect('/entrar/' + user.nome);
    }
    response.render('entrar', { nome: user.nome, online: online, root: root });
});
app.get('/registrar', function(request,response){
    msg = '';
    if(user.id != null){
        response.redirect('/' + user.nome);
    }
        response.render('registrar',{nome: user.nome, online: online  ,msg: msg, root: root});
});
app.get('/doces', function(request,response){
    msg: '';
    if(user.id != null){
        response.redirect('/doces/' + user.nome);
    }
    response.render('doces', { nome: user.nome, online: online, root: root});
});
app.get('/salgados', function(request,response){
    msg: '';
    if(user.id != null){
        response.redirect('/salgados/' + user.nome);
    }
    response.render('salgados', { nome: user.nome, online: online, root: root});
});
app.get('/pedidos', function(request,response){
    msg: '';
    if(user.id != null){
        response.redirect('/pedidos/' + user.nome);
    }
    response.render('pedidos', { nome: user.nome, online: online, root: root, usuario: user});
});
app.get('/tabela-nutricional', function(request,response){
    msg: '';
    if(user.id != null){
        response.redirect('/tabela-nutricional/' + user.nome);
    }
    response.render('tbnutri', { nome: user.nome, online: online, root: root });
});
app.get('/seuspedidos', function(request,response){
    msg: '';
    if(user.nome != '' && user.id !== 1){
        response.redirect('/seuspedidos/' + user.nome);
    }
    else{
        response.redirect('/' + user.nome);
    }
});
app.get('/todosospedidos', function(request,response){
    msg: '';
    if(user.id === 1){
        response.redirect('/todosospedidos/' + user.nome);
    }
    else{
        response.redirect('/' + user.nome);
    }
});
app.get('/usuario', function(request,response){
    msg: '';
    response.redirect('/usuario/' + user.nome);
    /*if(user.id === 1){
    }
    else{
        response.redirect('/' + user.nome);
    }*/
});
app.post('/registrar', function(request, response){
    if(!send(request.body.nome,request.body.email,request.body.senha, request.body.confirmsenha)){
        msg = 'Nome e/ou senha inválida';
        response.render('registrar',{nome: user.nome, online: online  ,msg: msg , root: root});
    }
    else{
        Usuarios.findOne({ where: { email: request.body.email }}).then(function(user){
            if(user != null){       
                msg = 'Não foi possível fazer o registro de conta';
                response.render('registrar',{nome: user.nome, online: online  ,msg: msg, root: root});
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
        }).then(function(usuario){
            console.log(usuario);
            msg = 'Registro feito com sucesso';
            response.render('registrar',{nome: user.nome, online: online , msg: msg, root: root});
        }).catch(function(){
            msg = 'Não fui possível fazer o registro da conta';
            response.render('registrar',{nome: user.nome, online: online ,msg: msg, root: root});
        });
    }
});
app.post('/pedidos', function(request, response){
    if(typeof request.body.orders != typeof "Olá"){
        var produtosEscolhidos = '';
        request.body.orders.forEach(function(produtoEscolhido) {
            produtosEscolhidos += produtoEscolhido + ', ';
        });
        produtosEscolhidos = produtosEscolhidos.slice(0,produtosEscolhidos.lastIndexOf(','));
    }
    else{
        var produtosEscolhidos = request.body.orders;
    }
    console.log(produtosEscolhidos);
    Pedidos.create({
        nome: request.body.nome,
        email: request.body.email,
        cep: request.body.cep,
        logradouro: request.body.address,
        numeroLogradouro: request.body.numaddress,
        complementoLogradouro: request.body.comp,
        cidade: request.body.cidade,
        estado: request.body.estado,
        produtos: produtosEscolhidos,
        complementoProdutos: request.body.comporder
    }).then(function(){
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Pedido feito com sucesso',
            online: online,
            root: root,
            usuario: user
        });
    }).catch(function(pedido){
        console.log(pedido);
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Não foi possível realizar o pedido',
            online: online,
            root: root
        });
    });
});
app.post('/pedidos/:user', function(request, response){
    msg: '';
    var bodyorder = request.body.orders;
    console.log(bodyorder, typeof bodyorder)
    if(typeof request.body.orders != typeof 'string'){
        var produtosEscolhidos = '';
        bodyorder.forEach(function(produtoEscolhido) {
            produtosEscolhidos += produtoEscolhido + ', ';
        });
        produtosEscolhidos = produtosEscolhidos.slice(0,produtosEscolhidos.lastIndexOf(','));
    }
    else{
        var produtosEscolhidos = bodyorder;
    }
    console.log(produtosEscolhidos);
    Pedidos.create({
        nome: request.body.nome,
        email: request.body.email,
        cep: request.body.cep,
        logradouro: request.body.address,
        numeroLogradouro: request.body.numaddress,
        complementoLogradouro: request.body.comp,
        cidade: request.body.cidade,
        estado: request.body.estado,
        produtos: produtosEscolhidos,
        complementoProdutos: request.body.comporder
    }).then(function(){
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Pedido feito com sucesso',
            online: online,
            root: root 
        });
    }).catch(function(pedido){
        console.log(pedido);
        response.render('pedidos', {
            nome: user.nome ,
            msg: 'Não foi possível realizar o pedido',
            online: online,
            root: root
        });
    });
});
app.post('/entrar/', function(request,response){
    msg: '';
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
    msg: '';
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
    msg: '';
    response.render('index', { nome: user.nome, online: online, root: root });
});
app.get('/doces/:user', function(request,response){
    msg: '';
    response.render('doces', { nome: user.nome, online: online, root: root });
});
app.get('/salgados/:user', function(request,response){
    msg: '';
    response.render('salgados', { nome: user.nome, online: online, root: root });
});
app.get('/pedidos/:user', function(request,response){
    msg: '';
    response.render('pedidos', { nome: user.nome, online: online, root: root, usuario: user });
});
app.get('/tabela-nutricional/:user', function(request,response){
    msg: '';
    response.render('tbnutri', { nome: user.nome, online: online, root: root });
});
app.get('/seuspedidos/:user', function(request,response){
    msg: '';
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
    msg: '';
    Pedidos.findAll().then(function(pedidos){
        console.log(pedidos);
        response.render('seuspedidos', { pedidos: pedidos, nome: user.nome, online: online, root: root });
    }).catch();
});
app.get('/usuario/:user', function(request,response){
    msg: '';
    if(user.id == 1){
            Usuarios.findAll().then(function(todosusuarios){
            console.log(todosusuarios);
            response.render('usuario', { nome: user.nome, online: online, root: root, usuarios: todosusuarios });
        }).catch();
    }else{
        Usuarios.findOne({
            where: {
                id: user.id
            }
        }).then(function(){
            response.render('usuario', { nome: user.nome, online: online, root: root, usuario: user });
        }).catch();
    }
});
function send(n,e,p,pp) {
    let getName = n
    let getEmail = e
    let getPassword = p
    let getConfirmPassword = pp
    var wrong = true;
    let regexnome = /\d+/
    let regexsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    console.log(n,e,p,pp);

    if(regexnome.test(getName) == true || getName === ""){

        wrong = false;

        console.log('Nome nulo ou com números');
        

    }

    if (regexsenha.test(getPassword) == true){

        wrong = false;
    }

    if (getPassword != getConfirmPassword){

        wrong = false;
        console.log('As senhas são diferentes');

    }
    console.log(wrong);
    return wrong;

}

// port
app.listen(3335);

