var express = require('express')
  , app = express()
  , port = process.env.PORT || 3000
  , bodyParser = require('body-parser')
  , models = require('./models/index.js')
  , Joi = require('joi')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , session = require('express-session')
  , sanitize = require('sanitize-html')


// ejs settings
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// express settings
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// passport settings
app.use(session({
  secret: process.env.SECRET
}))
app.use(passport.initialize())
app.use(passport.session())

// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
async function(email, password, done){
  let curUser = await models.user.findOne({where: {email: email} })
  if (!curUser) return done(null, false)
  if (!curUser.comparePassword(password)) return done(null, false)
  return done(null, curUser)
}
))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  let user = await models.user.findById(id)
  done(null, user)
})



app.get('/', async function (req,res){
  var data = {}
  var last_page = Math.ceil( (await models.post.count()) /10 ) || 1
  data.user = req.user
  data.posts = await models.post.findAll({
    limit:10,
    order: [['updatedAt', 'DESC']],
    include:[{model:models.user}]
  })
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
  var last_page = Math.ceil( (await models.post.count()) /10 ) || 1
  if ( req.params.page>last_page ){
    return res.redirect('/page/'+last_page)
  }
  data.user = req.user
  data.posts = await models.post.findAll({
    limit:10,
    offset:10*(req.params.page-1),
    order: [['updatedAt', 'DESC']],
    include:[{model:models.user}],
  })
  data.page = {'title':'Главная','current':req.params.page,'last':last_page}
  res.render('home',data)
  //var last_page = DB.get(count posts) / 10 , +1, if дробь
  //var author = DB.get(select * from users where id= post.author)
  //{"page":{"title":"Главная", "current":req.params.page,"last":last_page},"posts":
  //  [{"title":"Заголовок поста","id":1,"preview":"Описание поста","author":
  //   author}]}
})

app.get('/register', async function(req,res){
  if( req.isAuthenticated() ) return res.redirect('/')

  var data = {}
  data.page = {'title':'Регистрация'}
  data.user = false
  data.errors = []
  //if (authorised) res.redirect('/')
  res.render('register', data)
})

app.post('/register', async function(req,res,next){
  //if (authorised) res.redirect('/')
  if( req.isAuthenticated() ) return res.redirect('/')

  // validating schema
  var schema = Joi.object().keys({
    //name(ФИО): string, length <= 200 (due DB varchar), required
    name: Joi.string().max(200).required().label('ФИО'),
    //email(email): string, valid email, length<=200(due DB), required
    email: Joi.string().email().max(200).required().label('email'),
    //password(Пароль): string, 8<=length(more secure), length<=200(due DB), required
    password: Joi.string().min(8).max(200).required().label('Пароль'),
    //passwordagain(Повтор пароля), should be same as password
    passwordagain: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'Пароли должны совпадать' }} }).label('Повтор пароля')
  })
  // data from request
  var reqData = {
    name:req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordagain: req.body.passwordagain,

  }
  // config for schema
  var joiOptions = {
    abortEarly:false, //continue validating after 1st error
    language: { //error messages settings
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
  // validating
  var result = Joi.validate(reqData,schema, joiOptions)
  // check email for availableness
  if(reqData.email){
    var suchEmail = await models.user.findOne({ where: {email:reqData.email} })
  }
  // if sth wrong
  if(result.error || suchEmail){
    //data for rendering
    let data = {}
    data.user = false
    data.page = {'title':'Регистрация'}
    data.errors = []
    if(suchEmail){
      data.errors.push({'title':'email','message':'Уже занят'})
    }
    if(result.error){
      for(let err of result.error.details){
        let delInd = err.message.indexOf('": ')+3
        data.errors.push({
          'title':err.message.slice(0,delInd),
          'message':err.message.slice(delInd)
        })
      }
    }
    res.render('register',data)

  }else{ // if everything is OK

    //trying make model instance
    try {
      //make new user model instance
      var user = await models.user.create({
        name: reqData.name,
        email: reqData.email,
        password: reqData.password
      })

      req.login(user, function(err){
        // if server error
        if(err) return next(err)
        // ok -> redirect
        return res.redirect('/')
      })
      //
      // res.redirect('/')
    }catch(err){
      console.log(err)
      let data = {}
      data.user = false
      data.page = {'title':'Регистрация'}
      data.errors = []
      data.errors.push({'title':'Неизвестная ошибка','message':''})
      res.render('register',data)
    }
  }

})

app.get('/auth', async function(req,res){
  //if (authorised) res.redirect('/')
  if( req.isAuthenticated() ) return res.redirect('/')

  var data = {}
  data.errors = []
  data.user = false//TODO: debug
  data.page = {'title':'Вход'}
  res.render('auth', {'page':{'title':'Вход'}, 'user':false, 'errors':[]})
})

app.post('/auth', async function(req,res,next){
  // authorised users not allowed
  if( req.isAuthenticated() ) return res.redirect('/')

  // auth process
  return passport.authenticate('local',
    // authorisation function
    function(err,user){
      // server error
      if(err) return next(err)
      // client error
      if(!user){
        var data = {}
        data.errors = []
        data.user = false // becouse user is not auth.ed actually
        data.page = {'title':'Вход'}
        data.errors.push({'title':'Неверная комбинация логин/пароль', 'message':''})
        return res.render('auth',data)
      }
      // OK -> login
      req.login(user, function(err){
        // if server error
        if(err) return next(err)
        // ok -> redirect
        return res.redirect('/')
      })
    }
  )(req,res,next)

})

app.get('/logout', async function(req,res){
  req.logout()
  res.redirect('/')
})

app.get('/post/new', async function(req,res){

  if( !req.isAuthenticated() ) return res.redirect('/auth')

  var data = {}
  data.errors = []
  data.user = req.user
  data.page = {'title':'Новый пост'}
  data.fields = {}
  res.render('post',data)
})

app.post('/post/new', async function(req,res){
  if( !req.isAuthenticated() ) return res.redirect('/auth')

  var reqData = {
    title: req.body.title,
    preview: req.body.preview,
    text: req.body.text
  }

  var sanitizeConfig = {
    allowedTags: ['p','h1','h2','h3','h4','h5','h6','img','b','i','blockquote','pre','a'],
    allowedAttributes: {
      'a': ['href'],
      'img':['alt','src']
    }
  }
  var cleanData = {
    title: sanitize(reqData.title,sanitizeConfig),
    preview: sanitize(reqData.preview,sanitizeConfig),
    text: sanitize(reqData.text,sanitizeConfig)
  }

  try{
    var post = await models.post.create({
      title: cleanData.title,
      preview: cleanData.preview,
      text: cleanData.text,
      userId: req.user.id
    })
    res.redirect('/post/'+post.id)
  }catch(err){
    console.log(err)
    var data = {}
    data.errors = [{'title':'Неизвестная ошибка','message':''}]
    data.user = req.user
    data.page = {'title':'Новый пост'}
    data.fields = cleanData
    res.render('post',data)
  }
})

app.get('/post/:id', async function(req,res){
  //var post = DB(select * from posts where id= req.params.id)
  var data = {}
  data.user = req.user
  data.post = await models.post.findById(req.params.id,{include:[models.user]})
  data.page = {'title':data.post.title}
  res.render('details',data)
})

app.get('/post/:id/edit', async function(req,res){
  if( !req.isAuthenticated() ) return res.redirect('/auth')

  var post = await models.post.findById(req.params.id)

  if( req.user.id != post.userId && !req.user.isAdmin ){
    return res.redirect('/post/'+req.params.id)
  }

  var data = {}
  data.errors = []
  data.user = req.user
  data.page = {title:'Редактирование', action:'/post/'+post.id}
  data.fields = {title:post.title, preview:post.preview, text:post.text}
  res.render('post',data)
})

app.post('/post/:id', async function(req,res){
  if( !req.isAuthenticated() ) return res.redirect('/auth')

  var post = await models.post.findById(req.params.id)

  var reqData = {
    title: req.body.title,
    preview: req.body.preview,
    text: req.body.text
  }

  var sanitizeConfig = {
    allowedTags: ['p','h1','h2','h3','h4','h5','h6','img','b','i','blockquote','pre','a'],
    allowedAttributes: {
      'a': ['href'],
      'img':['alt','src']
    }
  }
  var cleanData = {
    title: sanitize(reqData.title,sanitizeConfig),
    preview: sanitize(reqData.preview,sanitizeConfig),
    text: sanitize(reqData.text,sanitizeConfig)
  }

  try{
    await post.update({
      title: cleanData.title,
      preview: cleanData.preview,
      text: cleanData.text,
    })
    res.redirect('/post/'+post.id)
  }catch(err){
    console.log(err)
    var data = {}
    data.errors = [{'title':'Неизвестная ошибка','message':''}]
    data.user = req.user
    data.page = {'title':'Новый пост', action:'/post/'+post.id}
    data.fields = cleanData
    res.render('post',data)
  }

})

app.get('/author/:id', async function(req,res){
  //var user = DB(select * from users where id= req.params.id)
  //var posts = DB(select * from posts where author = user)
  var data = {}
  data.user = req.user
  data.pageUser = await models.user.findById( req.params.id,
    {include:[{model:models.post, as:'posts'}]} )
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
