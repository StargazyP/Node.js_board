const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/home.html')
})

app.listen(8080, function() {
    console.log('server open');
})

app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html')
})

app.get()

app.get()

app.get()