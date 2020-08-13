const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
// const Article =require('../models/article.js');
router.get('/', (req, res, next) => {
  Article.getArticles((err,articles)=>{
    res.render('index',{
      title:'Index',
      articles:articles
    });
  },6);

});

router.get('/login',ensureGuest,(req,res)=>{
  res.render('login')
})

module.exports = router;
