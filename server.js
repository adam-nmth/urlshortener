var express = require('express');
var app = express();
var validUrl = require('valid-url');
var shortid = require('shortid');
var mongo = require('mongodb').MongoClient

var database = "urls"
var url = "mongodb://localhost:27017/"+database;
var db
mongo.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
})

app.use(express.static('public', { redirect : false }));

app.get('/', function (req, res){
    res.sendFile('index.html')
})
 
app.get('/:tag', function (req, res) {
    var tag = req.params.tag
    db.collection('urlcollection').find({"_id":tag}).toArray(function(err, results){
        if(err) throw("no records found")
        if(results.length!==0){
        res.redirect(results[0]["realurl"])
        }else{
            res.send("no document found")
        }
    })
});

app.get('/new/:id*', function (req, res) {
    var newurl = req.params['id'] + req.params[0];
    if (validUrl.isUri(newurl)){
        var rand = shortid.generate();
        var upload = {
            "_id": rand,
            "realurl": newurl
        }
        var message = {
            "original_url": newurl,
            "short_url": "https://nodejsprojects-mr-nemeth.c9users.io/"+rand
        }
        db.collection('urlcollection').insert(upload)
        res.send(message)
        
    } else {
        res.send("{'error': 'wrong url format'}");
    }
});


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});