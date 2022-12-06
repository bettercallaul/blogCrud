//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const app = express();
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const homeStartingContent =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi distinctio corporis sed accusamus quis quo necessitatibus reprehenderit perspiciatis exercitationem voluptatum maiores fugiat aperiam vel, aliquid officia fuga aliquam et, possimus nemo consequatur, cumque porro ducimus. Iure commodi ducimus possimus recusandae!';
const aboutContent = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus modi rem voluptatem quaerat.';
const contactContent = 'Lorem, ipsum dolor sit amet consectetur adipisicing.';

mongoose.connect(
  'mongodb://admin-sultan:admin123@ac-k1epehb-shard-00-00.jrhdvqu.mongodb.net:27017,ac-k1epehb-shard-00-01.jrhdvqu.mongodb.net:27017,ac-k1epehb-shard-00-02.jrhdvqu.mongodb.net:27017/?ssl=true&replicaSet=atlas-oay3g7-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model('Post', postSchema);

app.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home', {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get('/about', function (req, res) {
  res.render('about', { AboutContent: aboutContent });
});

app.get('/contact', function (req, res) {
  res.render('contact', { ContactContent: contactContent });
});

app.get('/compose', function (req, res) {
  res.render('compose');
});

app.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.get('/posts/:postId', (req, res) => {
  const elise = req.params.postId;

  Post.findOne({ _id: elise }, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content,
    });
  });
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === homeStartingContent) {
    Post.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log('ada yang error');
      } else {
        console.log('berhasil');
        res.redirect('/');
      }
    });
  } else {
    Post.findOneAndUpdate({ title: listName }, { $pull: { content: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
