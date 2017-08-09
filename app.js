var express = require('express')
  , app = express()
  , port = process.env.PORT || 3000


//ejs settings
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')


app.get('/', async function(req,res){
  res.send('home')
})

app.get('/page/:page', async function(req,res){
  res.send('home page#'+req.params.page)
})

app.get('/register', async function(req,res){
  res.send('registration GET')
})

app.post('/register', async function(req,res){
  res.send("registration POST")
})

app.post('/auth', async function(req,res){
  res.send('auth GET')
})

app.post('/auth', async function(req,res){
  res.send('auth POST')
})

app.get('/post/:id', async function(req,res){
  res.send('post#'+req.params.id)
})

app.get('/post/new', async function(req,res){
  res.send('new post GET')
})

app.post('/post/new', async function(req,res){
  res.send('new post POST')
})

app.get('/post/:id/edit', async function(req,res){
  res.send('edit post#'req.params.id' GET')
})

app.put('/post/:id', async function(req,res){
  res.send('edit post#'req.params.id' PUT')
})

app.get('/author/:id', async function(req,res){
  res.send('author#'+req.params.id)
})

app.listen(port, async function(){
  console.log('Started at port #',port)
})
