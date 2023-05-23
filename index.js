const express = require('express');

const app = express();

const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const port = 8080;

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');

const bcrypt = require('bcrypt');

const flash = require('connect-flash');

const nodemailer = require('nodemailer');

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

require('dotenv').config()

app.use(session({
  secret: '비밀코드',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
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

app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    req.session.destroy(); // 세션 삭제
    res.redirect('/'); // 로그인 페이지로 리다이렉트 또는 응답을 보낼 수 있습니다.
  });
});
app.get('/mypage', function (req, res) {
  // 세션에서 사용자 정보 가져오기
  var user = req.session.user;

  // 사용자 정보가 세션에 저장되어 있는지 확인
  if (user) {
    res.render('mypage.ejs', { 사용자: user }); // mypage.ejs 템플릿에 사용자 정보 전달
  } else {
    res.redirect('/login'); // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  }
});

app.get('/fail', function (요청, 응답) {
    응답.send('인증에 실패했습니다.');
});

function 로그인(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('로그인 안했음');
    }
}
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
app.post('/signup', async function (req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    const em = req.body.em;
  
    try {
      // 아이디 중복 체크
      const user = await db.collection('login').findOne({ id: id });
      if (user) {
        return res.send('이미 사용 중인 아이디입니다.');
      }
  
      // 비밀번호 해시
      const hashedPassword = await bcrypt.hash(pw, 10);
  
      // 사용자 정보 저장
      await db.collection('login').insertOne({ id: id, pw: hashedPassword, em: em});
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
    console.log('세션에 사용자 정보 저장 완료:', req.session.user);
    res.redirect('/'); // 메인 페이지로 리다이렉트 또는 응답을 보낼 수 있습니다.
  });
  
  app.post('/register', function(요청,응답){
    db.collection('login').insertOne({id : 요청.body.id, pw : 요청.body.pw}, function(에러,결과){
      응답.render('/')
    })
  });

var db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function(err, client) {
    if (err) console.log(err);
    else {
        db = client.db('server');
        console.log('db open');
    }
});
const { ObjectId } = require('mongodb');
app.post('/chatroom', 로그인, function(req,res){

  var 저장할거임 = {
    title : '무슨채팅방',
    member : [req.body.당한사람id, req.user._id],
    date : new Date()
  }
  db.collection('chatroom').insertOne(저장할거임).then(function(result){
    res.send('저장완료')
  });
});

app.get('/chat', 로그인, function(req,res){

  db.collection('chatroom').find({ member : req.user._id }).toArray().then((result)=>{
    res.render('chat.ejs', { data : result})

  })
})

app.post('/message', 로그인, function(req,res){
  var 저장할거야 = {
    parent : req.body.parent,
    userid: req.user._id,
    content : req.body.content,
    date : new Date(),
  }
  db.collection('message').insertOne(저장할거야).then((result)=>{
    res.send(result);
  })
});

app.get('/message/:id',로그인,function(req,res){
  res.writeHead(200, {
    "Connection" : "keep-alive",
    "Content-Type" : "text/event-stream",
    "Cache-Control" : "no-cache",
  });
  db.collection('message').find({ parent : req.params.id}).toArray().then((result)=>{
  res.write('event: test\n');
  res.write('data:' + JSON.stringify(result) +'\n\n');
  })
  const pipeline = [
    { $match : {'fullDocument.parent': req.params.id} }
  ];
  const collection = db.collection('message');
  const changeStream = collection.watch(pipeline);
  changeStream.on('change', (result)=>{
    res.write('event: test\n');
    res.write('data: ' + JSON.stringify([result.fullDocument]) + '\n\n');

  });
});
app.get('/', function(req,res){
    res.sendFile(__dirname + '/home.html')
})
app.get('/findid', function(req,res){
  res.render('findid.ejs');
})
app.post('/findid', function (req, res) {
  const email = req.body.email; // 폼에서 전송된 이메일 값을 가져옵니다.

  db.collection('login').findOne({ em: email }, function (err, result) {
    if (err) {
      console.error('ID 검색 중 오류 발생:', err);
      res.status(500).send('서버 오류');
    } else {
      if (result && result.em) {
        res.send(`아이디는 : ${result.id} 입니다.`);
      } else {
        res.send('검색 결과가 없습니다.');
      }
    }
  });
});

app.get('/reset-password', function(req,res){
  res.render('reset-password.ejs');
})
app.post('/reset-password', function(req,res){
  const email = req.body.email; // 폼에서 전송된 이메일 값을 가져옵니다.
  // 암호 변경 페이지 URL을 생성합니다.
  const resetPasswordUrl = `http://example.com/reset-password?email=${encodeURIComponent(email)}`;

  // 이메일 전송을 위한 transporter를 설정합니다.
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jangdong041512@gmail.com',
      pass: 'fwnptpwoambbyklj'
    }
  });

  // 이메일 옵션을 설정합니다.
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: '암호 변경',
    text: `다음 링크를 통해 암호를 변경하세요: ${resetPasswordUrl}`
  };

  // 이메일을 전송합니다.
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('이메일 전송 중 오류 발생:', error);
      res.status(500).send('서버 오류');
    } else {
      console.log('이메일이 성공적으로 전송되었습니다.');
      res.send('이메일이 전송되었습니다.');
    }
  });
});


// app.post('/findpw',function(req,res){
//   const em = req.body.email;
//   db.collection('login').findOne({id : id, em : em}, function(err,result){
//     if (err) {
//       console.error('오류 발생:', err);
//       res.status(500).send('서버 오류');
//     }else {
//       if(result.id && result.em){
//         res.send(`아이디는 : ${result.id} 이고 이메일은 ${result.em} 입니다.`)
//       }else{
//         res.send('검색결과없음');
//       }
//     }
//   })
// })
app.get('/search', (요청, 응답)=>{

  var 검색조건 = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: 요청.query.value,
          path: ['제목','날짜']  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
        }
      }
    },
    {$sort : { _id : 1} },
    {$limit : 10},
    {$project : { 제목 : 1, _id:0}}
  ] 
  console.log(요청.query);
  db.collection('post').aggregate(검색조건).toArray((에러, 결과)=>{
    console.log(결과)
    응답.render('search.ejs', {posts : 결과})
  })
})

app.get('/write', function(req, res) {
  if (!req.user) {
    console.log('로그인되지 않았습니다.');
    req.flash('error', '로그인이 필요합니다.'); // 클라이언트에게 전달할 에러 메시지 설정
    return res.redirect('/login'); // 로그인 페이지로 리다이렉트
  }
  res.sendFile(__dirname + '/write.html');
});

app.get('/list', function(요청,응답){
  if (!요청.user) {
    console.log('로그인되지 않았습니다.');
    요청.flash('error', '로그인이 필요합니다.'); // 클라이언트에게 전달할 에러 메시지 설정
    return 응답.redirect('/login'); // 로그인 페이지로 리다이렉트
  }
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

  // 로그인된 사용자인지 확인
  if (!req.user) {
    console.log('로그인되지 않았습니다.');
    return res.redirect('/login'); // 로그인 페이지로 리다이렉트
  }

  db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
    console.log(결과.toTalPost);
    var 총게시물갯수 = 결과.toTalPost;

    var 저장할거 = {
      _id: 총게시물갯수 + 1,
      작성자: req.user._id,
      제목: req.body.title,
      날짜: req.body.date
    };

    db.collection('post').insertOne(저장할거, function (에러, 결과) {
      db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { toTalPost: 1 } }, function (에러, 결과) {
        if (에러) {
          console.log('에러');
          return res.send('에러 발생'); // 에러 처리를 진행하세요.
        }
        console.log('저장완료');
        res.redirect('/');
      });
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

http.listen(process.env.PORT, function() {
    console.log('server open');
});

app.get('/socket', function(req,res){
  res.render('socket.ejs')
})

io.on('connection', function(socket){
  console.log('유저접속함');

  socket.on('room1-send',function(data){
    io.to('room1').emit('broadcast', data);
  });

  socket.on('joinroom',function(data){
    socket.join('room1');
  });

  socket.on('user-send',function(data){
    io.emit('broadcast',data);
  });
 
})