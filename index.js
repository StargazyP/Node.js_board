const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const port = 8080;

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');

const bcrypt = require('bcrypt');

app.use(session({
    secret: '비밀코드',
    resave: true,
    saveUninitialized: false
  }));
  
app.use(bodyParser.urlencoded({ extended: true }));

// allow us to get the data in request.body
app.use(express.json({ extended: false })); 

app.get('/edit', function(요청,응답){
    응답.render('edit.ejs')
})

app.get('/signup', function(요청,응답){
    응답.render('signup.ejs');
})

app.get('/login', function(요청,응답){
    응답.render('login.ejs');
});

app.get('/mypage', function(요청,응답){
    console.log(요청.user);
    응답.render('mypage.ejs', {사용자 : 요청.user});
});

app.get('/fail', function (요청, 응답) {
    응답.send('인증에 실패했습니다.');
});

function 로그인(요청, 응답, next) {
    if (요청.user) {
        next();
    } else {
        응답.send('로그인 안했음');
    }
}

app.post('/signup', async function (req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
  
    try {
      // 아이디 중복 체크
      const user = await db.collection('login').findOne({ id: id });
      if (user) {
        return res.send('이미 사용 중인 아이디입니다.');
      }
  
      // 비밀번호 해시
      const hashedPassword = await bcrypt.hash(pw, 10);
  
      // 사용자 정보 저장
      await db.collection('login').insertOne({ id: id, pw: hashedPassword });
      res.redirect('/login');
    } catch (error) {
      console.log(error);
      res.status(500).send('회원가입에 실패했습니다.');
    }
  });

  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail'
  }), function (req, res) {
    req.session.user = req.user; // 세션에 사용자 정보 저장
    res.redirect('/');
  });

  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    db.collection('login').findOne({ id: 입력한아이디 }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: '존재하지 않는 아이디입니다.' });
      }
      try {
        const match = await bcrypt.compare(입력한비번, user.pw);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } catch (error) {
        return done(error);
      }
    });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (아이디, done) {
    db.collection('login').findOne({ id: 아이디 }, function (err, user) {
      done(err, user);
    });
  });

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'))

//mongodb
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
});
app.get('/detail/:id', function(요청,응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id) }, function(에러,결과){
        응답.render('detail.ejs', {data : 결과})
    })
});

// DB에 입력한 데이터를 전송하는 POST
app.post('/add', function (req, res) {
    if (!db) {
        console.log('DB 연결 오류');
        return;
    }
    db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
        console.log(결과.toTalPost);
        var 총게시물갯수 = 결과.toTalPost;

        db.collection('post').insertOne({ _id: 총게시물갯수 + 1, 제목: req.body.title, 내용: req.body.date }, function (에러, 결과) {
            db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { toTalPost: 1 } }, function (에러, 결과) {
                if (에러) {
                    return console.log('에러');
                }
                res.send('전송완료');
            })

            console.log('저장완료');
        });
    });
});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
      console.log('삭제완료');
    });
    응답.send('삭제완료');
  });

app.listen(8080, function() {
    console.log('server open');
});