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

app.get('/list', function(요청,응답){
    //디비에 저장된 post 라는 collection 의 데어터들을 모두 꺼냄.
    db.collection('post').find().toArray(function (에러,결과){
       
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    });
    
})

app.post('/add', function(req,res){
    res.send('전송완료');
    if (!db) {
        console.log('DB 연결 오류');
        return;
    }
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러,결과){
        console.log(결과.toTalPost);
        var 총게시물갯수 = 결과.toTalPost;
        
    db.collection('post').insertOne({ _id  : 총게시물갯수 + 1,제목 : req.body.title, 내용 : req.body.date }, function(에러,결과){
        db.collection('counter').updateOne({name : '게시물갯수'}, {$inc : {toTalPost:1}}, function(에러,결과){
            if(에러){return console.log('에러');}
            res.send('전송완료');
        })
        
        console.log('저장완료');

    });
    });
});

app.listen(8080, function() {
    console.log('server open');
});