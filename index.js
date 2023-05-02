const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

var db;
MongoClient.connect('mongodb+srv://jdajsl0415:blackser7789@cluster0.wxlph6a.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function(err, client) {
    if (err) console.log(err);
    else {
        db = client.db('server');
        console.log('db open');
    }
});


app.get('/', function(req,res){
    res.sendFile(__dirname + '/home.html')
})



app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html')
})

app.get('/list', function(req,res){
    res.render('list.ejs')
})

app.post('/add', function(req,res){
    if (!db) {
        console.log('DB 연결 오류');
        return;
    }
    db.collection('post').insertOne({ 제목 : req.body.title, 날짜 : req.body.date }, function(){
        console.log('저장완료');
    });
    res.send('전송완료');
});

app.listen(8080, function() {
    console.log('server open');
})