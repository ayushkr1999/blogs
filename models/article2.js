const mongoose =require('mongoose');


//Aeticle schema

const article2Schema = mongoose.Schema({
  title:{
    type:String
  },

  subtitle:{
    type:String
  },
  category:{
    type:String
  },
  author:{
    type:String
  },
  body:{
    type:String
  },
  created_at:{
    type:Date,
    default: Date.now
  },
  comments:[{
    comment_subject:{
      type:String
    },
    comment_body:{
      type:String
    },
    comment_author:{
      type:String
    },
    comment_email:{
      type:String
    },
    comment_date:{
      type:String
    }
  }]
});

const Article2= module.exports = mongoose.model('Article2', article2Schema);

//get category
module.exports.getArticles =function(callback,limit){
  Article2.find(callback ).limit(limit).sort([['title','ascending']]);
}

// add articel
module.exports.addArticle = function(article,callback){
  Article2.create(article,callback);
}

//get single articel buy id
module.exports.getArticleById = function(id,callback){
  Article2.findById(id,callback);
}
//update articel
module.exports.updateArticle = function(query,update,options,callback){
  Article2.findOneAndUpdate(query,update,options,callback);
}

//delete articel
module.exports.removeArticle = function(query,callback){
  Article2.deleteOne(query,callback);
}

//get article by Category
module.exports.getCategoryArticles = function(categoryId,callback){
  let query={category:categoryId}
  Article2.find(query,callback).sort([['title','ascending']]);
}

//add comemnt
// module.exports.addComment = function(query,comment,callback){
//   Article2.update(query ,
//     {
//       $push:{
//         comments:comment
//        }
//     },
//     callback
//   );
// }
