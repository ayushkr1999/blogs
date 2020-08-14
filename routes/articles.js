const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Article = require('../models/article.js');
const Article2 = require('../models/article2.js');

router.get('/', (req, res, next) => {
  Article.getArticles((err,articles)=>{
    res.render('articles',{
      title: 'Articles',
      articles:articles
    });
  });
});

//show all admin articles
router.get('/admin', (req, res, next) => {
  Article2.getArticles((err,articles)=>{
    res.render('articles2',{
      title: 'Articlesadmin',
      articles:articles
    });
  });
});



router.get('/show/:id', (req, res, next) => {
    Article.getArticleById(req.params.id, (err, article)=>{
      // console.log(article.title);
      res.render('article',{
        title: 'Article',
        article: article
      });
    });

});

// get pushing articles
router.get('/admin/show/:id', (req, res, next) => {
    Article2.getArticleById(req.params.id, (err, article)=>{
      // console.log(article.title);
      res.render('article2',{
        title: 'Articleadmin',
        article: article
      });
    });

});

// push article
router.get('/admin/show/add/:id',(req,res,next)=>{

  // let article2 =new Article();

  // category.description=req.body.description;
  Article2.getArticleById(req.params.id, (err, article)=>{
    // console.log(article.title);
    // console.log(article.title);
    // console.log(article.subtitle);
    let article2 =new Article();
    article2.title=article.title;
    article2.subtitle=article.subtitle;
    article2.category=article.category;
    article2.body=article.body;
    article2.author=article.author;

    Article.addArticle(article2,(err, article2)=>{
      if(err){
        res.send(err);
      }
      // req.flash('success','You Article will be added when its Verified');
      res.redirect('/articles/admin');
    });
  });

});

router.get('/category/:category_id', (req, res, next) => {
  Article.getCategoryArticles(req.params.category_id,(err,articles)=>{
    Category.getCategoryById(req.params.category_id,(err,category)=>{
      res.render('articles',{
        title: category.title+' Articles',
        articles:articles
      });

    });

  });

});

//add artciles
router.post('/add' ,ensureAuth ,(req,res,next)=>{
  req.checkBody('title','Title is req').notEmpty();
  req.checkBody('author','author is req').notEmpty();
  req.checkBody('category','category is req').notEmpty();
  req.checkBody('body','body is req').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    Category.getCategories((err,categories)=>{
      res.render('add_article',{
        errors:errors,
        title:'Create Article',
        categories:categories
      });
    });

  }
  else{
    let article =new Article2();
    article.title=req.body.title;
    article.subtitle=req.body.subtitle;
    article.category=req.body.category;
    article.body=req.body.body;
    article.author=req.body.author;
    // category.description=req.body.description;

    Article2.addArticle(article,(err, article)=>{
      if(err){
        res.send(err);
      }
      req.flash('success','You Article will be added when its Verified');
      res.redirect('/manage/articles');
    });
  }

});

//edit articlse -post
router.post('/edit/:id' ,ensureAuth, (req,res,next)=>{
  req.checkBody('title','Title is req').notEmpty();
  req.checkBody('author','author is req').notEmpty();
  req.checkBody('category','category is req').notEmpty();
  req.checkBody('body','body is req').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    Category.getCategories((err,categories)=>{
      res.render('edit_article',{
        errors:errors,
        title:'Edit Article',
        categories:categories
      });
    });
  }
  else{
    let article =new Article();
    const query = {_id: req.params.id}
    const update = {
      title:req.body.title,
      subtitle:req.body.subtitle,
      category:req.body.category,
      author:req.body.author,
      body:req.body.body
    }

    // category.description=re q.body.description;

    Article.updateArticle(query,update,{},(err, article)=>{
      if(err){
        res.send(err);
      }
      req.flash('success','Article Updated');
      res.redirect('/manage/articles');
    });
  }


});


//delete article

router.delete('/delete/:id',ensureAuth,(req,res,next)=>{
  // let category =new Category();
  const query ={_id: req.params.id}
  // const update ={title :req.body.title, description:req.body.description}

  Article.removeArticle(query,(err, article)=>{
    if(err){
      res.send(err);
    }
    // res.redirect('/manage/categories');
    res.status(200);
  });

});

router.post('/comments/add/:id',(req,res,next)=>{
  req.checkBody('comment_subject','subject is req').notEmpty();
  req.checkBody('comment_author','author is req').notEmpty();
  // req.checkBody('category','category is req').notEmpty();
  req.checkBody('comment_body','Body is req').notEmpty();

  let errors=req.validationErrors();

  if(errors){
    Article.getArticleById(req.params.id, (err, article)=>{
      // console.log(article.title);
      res.render('article',{
        title: 'Article',
        article: article,
        errors:errors
      });
    });
  }

  else{
    let article=new Article();
    let query={_id:req.params.id}

    let comment={
      comment_subject: req.body.comment_subject,
      comment_author: req.body.comment_author,
      comment_body: req.body.comment_body,
      comment_email: req.body.comment_email,
    }

    Article.addComment(query,comment,(err,article)=>{
      res.redirect('/articles/show/'+req.params.id);
    });
  }
});
module.exports = router;
