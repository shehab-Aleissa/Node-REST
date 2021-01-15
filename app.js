//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Making a connection
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true})

//Defining the Class 
const articleSchema = {
    title: String,
    content: String
}

//Defining the MODEL =>ARTICLE<= "same as DJANGO"
const Article = mongoose.model("Article", articleSchema)


//GETING ALL ITEMS
app.get('/articles', function(req, res) {
    Article.find(function(err, result) {
        
        res.json(result)
    })
})
//GETTING 1 ITEM
app.get('/article/:articletitle', function(req, res) {
    let result = req.params.articletitle
    Article.findOne({title: result}, function(err, theResponse) {
        if (theResponse) {
            res.send(theResponse)
        } else {
            res.send("no match found")
        }
    })
})
//POSTING
app.post('/add-article', function(req, res) {
    let title = req.body.title
    let content = req.body.content

    const newArticle = new Article({
        title: title,
        content: content
    })
    newArticle.save(function(err, success) {
        if (!err) {
            res.send("seccuss")
        } else {
            res.send(err)
        }
    })
    
})
//UPDATING ALL
app.put('/article/:articletitle', function(req, res) {
    let parameter = req.params.articletitle
    let titleupdate = req.body.title
    let contentupdate = req.body.content

    Article.update({title: parameter}, {title: titleupdate, content: contentupdate}, {overwrite: true}, 
        function(wrong, ok) {
        if (ok) {
            res.send("UPDATED!")
        } else {
            res.send("Something Went Wrong")
        }
    })
})
//UPDATING SPECIFIC FIELD
app.patch('/article/:articletitle', function(req, res) {
    let specific = req.params.articletitle
    Article.update({title: specific}, {$set: req.body}, function(wrong, ok) {
        if (ok) {
            res.send("Updated OKAY")
        } else {
            res.send(wrong + "Something Went Wrong")
        }
    })
})
//DELETING ALL ITEMS
app.delete('/delete-all', function(req, res) {
    Article.deleteMany(function(err, succ) {
        if (!err) {
            res.send(succ + "DONE!")
        } else {
            res.send(err)
        }
    })
})
//DELETE SPECIFIC THING
app.delete('/deletespecific/:specific', function(req, res) {
    Article.deleteOne({title: req.params.specific},function(err, succ) {
        if (!err) {
            res.send(succ + "DELETEED!")
        } else {
            res.send(err + "Something Went WRONG")
        }
    })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});