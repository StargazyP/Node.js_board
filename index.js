const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})) 

var db;
MongoClient.connect('mongodb+srv://jdajsl0415:blackser7789@cluster0.wxlph6a.mongodb.net/test', function(req,res){
    if(req) console.log("에러")

    db = client.db('mentoling');

    app.listen(8080, function(){
        console.log("listening 8080")
    });
});


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

app.post('/add', function(req,res){
    res.send('전송완료');
    db.collection('post').insertOne({ 제목 : req.body.date, 날짜 : req.body.title }, function(req,res){
        console.log('저장완료');
    });
});