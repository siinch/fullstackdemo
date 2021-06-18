let url = "http://localhost:3001";

function insert() {
  fetch(url + "/insert/" + prompt("Name") + "/" + prompt("Score"))
  .then(response => response.json())
  .then(data => alert("Inserted highscore" + JSON.stringify(data)));
}

function findAll() {
  fetch(url + "/findAll")
  .then(response => response.json())
  .then(data => alert(JSON.stringify(data)));
}

function del() {
  fetch(url + "/delete/" + prompt("Name"))
  .then(response => response.json())
  .then(data => alert("Deleted: " + JSON.stringify(data)));
}

function update() {
  fetch(url + "/update/" + prompt("Name") + "/" + prompt("Score"))
  .then(response => response.json())
  .then(data => alert("Updated score: " + JSON.stringify(data)));
}
