const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://jdajsl0415:blackser7789@cluster0.wxlph6a.mongodb.net/test', function(req,res){
    if(req) return console.log("에러")

    db = client.db('server');

    db.collection('post').insertOne({이름 : 'jone', _id : 20}, function(req,res){
        console.log("저장완료");
    });

    app.listen(8080, function(){
        console.log("listening 8080")
    });
});
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

app.get('/list', function(req,res){
    res.sendFile(__dirname + '/list.html');
})