let url = "http://localhost:3001";

function insertHighscore() {

  let data = {
    name: prompt("Name:"),
    score: prompt("Score:")
  }

  fetch('./highscore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Highscore inserted:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function getHighscore() {
  fetch(url + "/highscore/" + prompt("Name:"))
  .then(response => response.json())
  .then(data => alert(JSON.stringify(data)));
}

function getHighscores() {
  fetch(url + "/highscores")
  .then(response => response.json())
  .then(data => alert(JSON.stringify(data)));
}

function deleteHighscore() {

  let data = {
    name: prompt("Name:")
  }

  fetch('./highscore', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Highscore deleted:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function updateHighscore() {

  let data = {
    name: prompt("Name:"),
    score: prompt("Score:")
  }

  fetch('./highscore', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Highscore updated:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function signUp() {

  let data = {
    username: prompt("Username:"),
    password: prompt("Password:")
  }

  fetch('./user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('User inserted:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}