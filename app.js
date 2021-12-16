var express = require('express');
var app = express();
var { engine } = require('express-handlebars');
var bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

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

// port
app.listen(3000);