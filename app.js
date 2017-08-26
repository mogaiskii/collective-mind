var express = require('express')
  , app = express()
  , port = process.env.PORT || 3000
  , bodyParser = require('body-parser')
  , models = require('./models/index.js')
  , Joi = require('joi')


// ejs settings
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// express settings
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', async function (req,res){
  var data = {}
  var last_page = 1 //TODO: debug
  data.user = false //TODO: debug
  data.posts = []
  data.page = {'title':'Главная','current':1,'last':last_page}
  res.render('home',data)
  //var last_page = DB.get(count posts) / 10 , +1, if дробь
  //var author = DB.get(select * from users where id= post.author)
//{"page":{"title":"Главная", "current":1,"last":last_page},"posts":
//  [{"title":"Заголовок поста","id":1,"preview":"Описание поста","author":
//   author}]}
})

app.get('/page/:page', async function(req,res){
  var data = {}
  var last_page = 1 //TODO: debug
  if ( req.params.page>last_page ){
    res.redirect('/page/'+last_page)
  }
  data.user = false //TODO: debug
  data.posts = []
  data.page = {'title':'Главная','current':req.params.page,'last':last_page}
  res.render('home',data)
  //var last_page = DB.get(count posts) / 10 , +1, if дробь
  //var author = DB.get(select * from users where id= post.author)
  //{"page":{"title":"Главная", "current":req.params.page,"last":last_page},"posts":
  //  [{"title":"Заголовок поста","id":1,"preview":"Описание поста","author":
  //   author}]}
})

app.get('/register', async function(req,res){
  var data = {}
  data.page = {'title':'Регистрация'}
  data.user = false
  data.errors = []
  //if (authorised) res.redirect('/')
  res.render('register', data)
})

app.post('/register', async function(req,res){
  //if (authorised) res.redirect('/')
  //checks FORM, if incorrect:
  var schema = Joi.object().keys({
    name: Joi.string().max(200).required().label('ФИО'),
    email: Joi.string().email().max(200).required().label('email'),
    password: Joi.string().min(8).max(200).required().label('Пароль'),
    passwordagain: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'Пароли должны совпадать' }} }).label('Повтор пароля')
  })
  var reqData = {
    name:req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordagain: req.body.passwordagain,

  }
  var joiOptions = {
    abortEarly:false,
    language: {
      key: '"{{key}}": ',
      any:{
        required: 'Необходимо заполнить',
        empty: 'Должно быть заполнено'
      },
      string:{
        email: 'Введите настоящий адрес электронной почты',
        min: 'Длина должна быть более {{limit}} символов',
        max: 'Длина не может превышать {{limit}} символов'
      }
    }
  }
  var result = Joi.validate(reqData,schema, joiOptions)
  if(reqData.email){
    var suchEmail = await models.user.findOne({ where: {email:reqData.email} })
    console.log(suchEmail)
  }
  if(!result.error && !suchEmail){
    res.redirect('/')
  }else{
    var data = {}
    data.errors = []
    if(suchEmail){
      data.errors.push({'title':'email','message':'Уже занят'})
    }
    data.user = false
    data.page = {'title':'Регистрация'}
    for(let err of result.error.details){
      var delInd = err.message.indexOf('": ')+3
      data.errors.push({
        'title':err.message.slice(0,delInd),
        'message':err.message.slice(delInd)
      })
    }
    res.render('register',data)
  }

})

app.get('/auth', async function(req,res){
  //if (authorised) res.redirect('/')
  var data = {}
  data.errors = []
  data.user = false//TODO: debug
  data.page = {'title':'Вход'}
  res.render('auth', {'page':{'title':'Вход'}, 'user':false, 'errors':[]})
})

app.post('/auth', async function(req,res){
  //if (authorised) res.redirect('/')
  //checks FORM, if incorrect:
  var data = {}
  data.errors = [{'title':'Ошибка','message':'Описание'}]
  data.user = false//TODO: debug
  data.page = {'title':'Вход'}
  res.render('auth')
})

app.get('/post/new', async function(req,res){
  //if (!auth) res.redirect('/auth')
  var data = {}
  data.errors = []
  data.user = true//TODO: debug
  data.page = {'title':'Новый пост'}
  res.render('post',data)
})

app.post('/post/new', async function(req,res){
  //if (!auth) res.redirect('/auth')
  //else if( all ok) DB(insert into posts (title, preview, text)
  // values (req.body.title,req.body.preview, req.body.text))
  // res.redirect('/post/'+id)
  //else (sth wrong)
  var data = {}
  data.errors = [{'title':'Ошибка','message':'Описание'}]
  data.user = true//TODO: debug
  data.page = {'title':'Новый пост'}
  res.render('post',data)
})

app.get('/post/:id', async function(req,res){
  //var post = DB(select * from posts where id= req.params.id)
  var data = {}
  data.user = false //TODO: debug
  var date = new Date() //TODO: debug . from timestamp
  data.post = {'title':'Заголовок', 'preview':'Описание','text':'Текст поста','date':date,'author':
    {'id':1,'name':'Автор'}}//TODO:debug
  data.page = {'title':data.post.title}
  res.render('details',data)
})

app.get('/post/:id/edit', async function(req,res){
  //if (!auth) res.redirect('/auth')
  var data = {}
  data.errors = [{'title':'Ошибка','message':'Описание'}]
  data.user = true//TODO: debug
  data.page = {'title':'Редактирование'}
  res.render('post')
})

app.put('/post/:id', async function(req,res){
  //if (!auth) res.redirect('/auth')
  //else if( all ok) DB(insert into posts (title, preview, text)
  // values (req.body.title,req.body.preview, req.body.text))
  // res.redirect('/post/'+id)
  //else (sth wrong)
  var data = {}
  data.errors = [{'title':'Ошибка','message':'Описание'}]
  data.user = true//TODO: debug
  data.page = {'title':'Редактирование'}
  res.render('post',data)
})

app.get('/author/:id', async function(req,res){
  //var user = DB(select * from users where id= req.params.id)
  //var posts = DB(select * from posts where author = user)
  var data = {}
  data.user = {'id':1,'name':'Автор'}//TODO: debug
  data.posts = [{'id':1,'title':'Заголовок','preview':'Описание'}]
  data.page = {'title':'Вход'}
  res.render('author',data)
  // {"page":{"title":user.name}, "user":user, "posts":posts}
})

models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    app.listen(port, async function(){
      console.log('Started at port #',port)
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
