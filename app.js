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

// get and post
app.get('/', function(request,response){
    response.render('index');
});


// port
app.listen(3000);