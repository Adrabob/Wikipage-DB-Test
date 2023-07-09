

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } 
  catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const articleSchema ={
    title : String,
    content: String 
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get((req, res) => {
    Article.find({})
    .then(function(foundArticles){
        res.send(foundArticles);
    })
    .catch(function(err) {
        console.log(err);
      });
})
.post((req, res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save();
})
.delete((req,res)=>{
    Article.deleteMany({})
    .then(function(){
      
    })
    .catch(function(err) {
        console.log(err);
      });
});

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }else{
            res.send("No articles found.");
        };
    })
    .catch(function(err) {
        console.log(err);
      });
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
        
        )
    .then(function(){
    })
    .catch(function(err) {
        console.log(err);
      });
})

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
        
        )
    .then(function(){
    })
    .catch(function(err) {
        console.log(err);
      });
})
.delete((req,res)=>{
    Article.deleteMany({title: req.params.articleTitle})
    .then(function(){
      
    })
    .catch(function(err) {
        console.log(err);
      });
});

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
      });
    });