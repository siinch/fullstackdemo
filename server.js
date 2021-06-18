const express = require("express");
const cors = require("cors");
const app = express();
var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
let url = "mongodb+srv://test:test@test.5kkg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.use(express.static(__dirname));

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

// insert new highscore
app.get("/insert/:name/:score", (request, response) => {
	console.log("Inserting highscore: " + request.params.name + ", " + request.params.score);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: request.params.name, score: request.params.score};
    dbo.collection("highscores").insertOne(myobj, function(err, res) {
      if (err) throw err;

      console.log("Inserted: " + JSON.stringify(myobj))
      response.header("Access-Control-Allow-Origin", "*");
      response.json(myobj);
      db.close();
    });
  });
});

// find all highscores
app.get("/findAll", (request, response) => {
	console.log("Finding highscores... ");

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("highscores").find({}).toArray(function(err, result) {
      if (err) throw err;

      console.log(result);
      response.header("Access-Control-Allow-Origin", "*");
      response.json({highscores: result});
      db.close();
    });
  });
});

// delete highscore
app.get("/delete/:name", (request, response) => {
	console.log("Deleting highscore: " + request.params.name);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { name: request.params.name };
    dbo.collection("highscores").deleteOne(myquery, function(err, obj) {
      if (err) throw err;

      console.log("Deleted: " + JSON.stringify(myquery))
      response.header("Access-Control-Allow-Origin", "*");
      response.json(myquery);
      db.close();
    });
  });
});

// updating highscore
app.get("/update/:name/:score", (request, response) => {
	console.log("Updating highscore of " + request.params.name + " to " + request.params.score);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { name: request.params.name };
    var newvalues = { $set: {score: request.params.score } };
    dbo.collection("highscores").updateOne(myquery, newvalues, function(err, obj) {
      if (err) throw err;

      console.log("Updated score of: " + request.params.name + " to " + request.params.score)
      response.header("Access-Control-Allow-Origin", "*");
      response.json({name: request.params.name, score: request.params.score});
      db.close();
    });
  });
});

// start server
const port = 3001;
app.listen(port, () => console.log("Listening on port " + port));
