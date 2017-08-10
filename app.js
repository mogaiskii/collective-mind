var express = require('express')
  , app = express()
  , port = process.env.PORT || 3000
  , bodyParser = require('body-parser')


// ejs settings
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// express settings
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async function(req,res){
  res.render('home')
  //var last_page = DB.get(count posts) / 10 , +1, if дробь
  //var author = DB.get(select * from users where id= post.author)
   //{"page":{"title":"Главная", "current":1,"last":last_page},"posts":
   //  [{"title":"Заголовок поста","id":1,"preview":"Описание поста","author":
   //   author}]}
})

app.get('/page/:page', async function(req,res){
  res.render('home')
  //var last_page = DB.get(count posts) / 10 , +1, if дробь
  //var author = DB.get(select * from users where id= post.author)
   //{"page":{"title":"Главная", "current":req.params.page,"last":last_page},"posts":
   //  [{"title":"Заголовок поста","id":1,"preview":"Описание поста","author":
   //   author}]}
})

app.get('/register', async function(req,res){
  //if (authorised) res.redirect('/')
  res.render('register')
  //{"page":{"title":"Регистрация"}}
})

app.post('/register', async function(req,res){
  //if (authorised) res.redirect('/')
  //checks FORM, if incorrect:
  res.render('register')
  //{"errors":[{"title":"Название ошибки", "message":"Описание ошибки"}],
  //"form":{"email":req.body.email,
   //  "name":req.body.name,"password":req.body.password,
   //  "passwordagain":req.body.passwordagain},
 //"page"{"title":"Регистрация"}}
})

app.get('/auth', async function(req,res){
  //if (authorised) res.redirect('/')
  res.render('auth')
  //{"page"{"title":"Регистрация"}}
})

app.post('/auth', async function(req,res){
  //if (authorised) res.redirect('/')
  //checks FORM, if incorrect:
  res.render('auth')
  //{"errors":[{"title":"Название ошибки", "message":"Описание ошибки"}]
  //"form":{"email":req.body.email},
  // "page":"Вход"}
})

app.get('/post/:id', async function(req,res){
  //var post = DB(select * from posts where id= req.params.id)
  res.render('details')
  //{"page":post.title,"post":post}
})

app.get('/post/new', async function(req,res){
  //if (!auth) res.redirect('/auth')
  res.render('post')
  //{"page":{"title":"Новый пост"}}
})

app.post('/post/new', async function(req,res){
  //if (!auth) res.redirect('/auth')
  //else if( all ok) DB(insert into posts (title, preview, text)
  // values (req.body.title,req.body.preview, req.body.text))
  // res.redirect('/post/'+id)
  //else (sth wrong)
  res.render('post')
  //{"page":{"title":"Новый пост"}, "form":{"title":req.body.title,
  //  "preview":req.body.preview,"text":req.body.text}}
})

app.get('/post/:id/edit', async function(req,res){
  //if (!auth) res.redirect('/auth')
  res.render('post')
  //{"page":{"title":"Редактирование"}, "form":{"title":req.body.title,
  //  "preview":req.body.preview,"text":req.body.text}}
})

app.put('/post/:id', async function(req,res){
  //if (!auth) res.redirect('/auth')
  //else if( all ok) DB(insert into posts (title, preview, text)
  // values (req.body.title,req.body.preview, req.body.text))
  // res.redirect('/post/'+id)
  //else (sth wrong)
  res.send('edit post#'req.params.id' PUT')
  //{"page":{"title":"Новый пост"}, "form":{"title":req.body.title,
  //  "preview":req.body.preview,"text":req.body.text}}
})

app.get('/author/:id', async function(req,res){
  //var user = DB(select * from users where id= req.params.id)
  //var posts = DB(select * from posts where author = user)
  res.render('author')
  // {"page":{"title":user.name}, "user":user, "posts":posts}
})

app.listen(port, async function(){
  console.log('Started at port #',port)
})
