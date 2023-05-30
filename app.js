const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

const dbURI ='mongodb+srv://React:React123!@cluster0.izjm3xj.mongodb.net/cluster0?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology: true})
.then((result)=> app.listen(3000) )
.catch((err)=> console.log(err));

// listen for requests
//app.listen(3000);
app.set('view engine', 'ejs')

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
//routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


//blog routes
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs', (req, res)=> {
//  Blog.find()
  Blog.find().sort({createdAt: -1 })
  .then(result => {
     res.render('index', { blogs: 'All Blogs', blogs: result })
  })
  .catch(err => {
    console.log(err);
  });
});

app.post('/blogs', (req, res) => {
  console.log(req.body);
  const blog = new Blog(req.body);
  blog.save()
  .then(result=> {
    res.redirect('/blogs');
  }) 
  .catch(err=>{
    console.log(err);
  })
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  // console.log(id);
  Blog.findById(id)
  .then(result => {
    res.render('details', { blog: result,  title: 'Blog Details'});
  })
  .catch(err => {
    console.log(err);
  });
  console.log(" pre delete"+ id);
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  console.log("delete"+ id);
  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/blogs'});
  })
    .catch(err => {
      console.log(err) 
    
  });
});


// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
