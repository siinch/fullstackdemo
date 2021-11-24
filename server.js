// import the neccessary libraries
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

// configure express server
app.use(express.static("./"));
app.use(express.json());
const port = 3001;

// configure database connection
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

// configure security parameters
const saltRounds = 10;

// get request at root
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

      console.log("Deleted: " + JSON.stringify(myquery));
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

// new user signup
app.post("/user", async (request, response) => {

  // hash the password
  let hash = await bcrypt.hash(
    request.body.password, saltRounds);

  console.log(
    "Inserting new user: " +
    request.body.username + ", " + hash
  );
    

  // connect to the database
  let db = await MongoClient.connect(url);

  let dbo = db.db("mydb");
  let myobj = {
        username: request.body.username, 
        hash: hash
  };

  // try to insert the new user
  try {
    let result = await dbo.collection("users").insertOne(myobj);
    console.log("Created user:", myobj)
    response.json(myobj);
  }
  catch (error){
    console.log("Username occupied:", myobj)
    response.json({message: "Username occupied"});
  }

  db.close();
});

// start server
app.listen(port, () => console.log("Listening on port " + port));
