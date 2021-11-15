const express = require("express");
//const cors = require("cors");
const app = express();
app.use(express.static("./"));
app.use(express.json());
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
const port = 3001;
//let url = "mongodb+srv://test:test@test.5kkg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.get("/", (request, response) => {
  response.sendFile("/index.html");
});

// insert new highscore
app.post("/highscore", (request, response) => {
	console.log("Inserting highscore: " + request.body.name + ", " + request.body.score);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: request.body.name, score: request.body.score};
    dbo.collection("highscores").insertOne(myobj, function(err, res) {
      if (err) throw err;

      console.log("Inserted: " + JSON.stringify(myobj))
      response.header("Access-Control-Allow-Origin", "*");
      response.json(myobj);
      db.close();
    });
  });
});

// get specific highscore
app.get("/highscore/:name", (request, response) => {
	console.log("Finding highscores... ");

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("highscores")
    .find({name: request.params.name})
    .toArray(function(err, result) {
      if (err) throw err;

      console.log(result);
      //response.header("Access-Control-Allow-Origin", "*");
      response.json({highscores: result});
      db.close();
    });
  });
});

// get all highscores
app.get("/highscores", (request, response) => {
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
app.delete("/highscore", (request, response) => {
	console.log("Deleting highscore: " + request.body.name);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { name: request.body.name };
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
app.put("/highscore", (request, response) => {
	console.log("Updating highscore of " + request.body.name + " to " + request.body.score);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { name: request.body.name };
    var newvalues = { $set: {score: request.body.score } };
    dbo.collection("highscores").updateOne(myquery, newvalues, function(err, obj) {
      if (err) throw err;

      console.log("Updated score of: " + request.body.name + " to " + request.body.score)
      response.header("Access-Control-Allow-Origin", "*");
      response.json({name: request.body.name, score: request.body.score});
      db.close();
    });
  });
});

// start server
app.listen(port, () => console.log("Listening on port " + port));
