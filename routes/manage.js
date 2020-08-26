const express = require('express');
const router = express.Router();
Category =require('../models/category.js');
Article =require('../models/article.js');
Article2 =require('../models/article2.js');
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/articles',ensureAuth, (req, res, next) => {
  Article.getArticlesbyauth(req.user.id,req.user.firstName,(err,articles)=>{
    if(err){
      res.send(err);
    }
    res.render('manage_articles',{
      title: 'Manage Articles',
      articles:articles,
      name: req.user.firstName
    });
  });

});

router.get('/categories',ensureAuth,(req, res, next) => {
   Category.getCategories((err , categories)=>{
    if(err){
      res.send(err);
    }

    // console.log(categories);
    res.render('manage_categories',{
      title:'Categories',
      categories:categories
    });

  });

});



router.get('/articles/add', (req, res, next) => {
  Category.getCategories((err,categories)=>{
    if(err){
      res.send(err);
    }
    res.render('add_article', {
      title: 'Create Article',
      categories:categories
    });
  });

});

router.get('/categories/add', (req, res, next) => {
  res.render('add_category', {title: 'Create Category'});
});



//edit category page -GET
router.get('/categories/edit/:id', (req, res, next) => {
Category.getCategoryById(req.params.id,(err,category)=>{
  if(err){
    res.send(err);
  }
  res.render('edit_category', {
    title: 'Edit Category',
    category:category
  });
})

});

//Edit article page -GET
router.get('/articles/edit/:id', (req, res, next) => {
Article.getArticleById(req.params.id,(err,article)=>{
  if(err){
    res.send(err);
  }
  Category.getCategories((err,categories)=>{
    res.render('edit_article', {
      title: 'Edit Article',
      article:article,
      categories:categories
    });
  });

});

});


module.exports = router;
