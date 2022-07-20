const express = require('express');
const path = require('path');
const fs = require('fs');
const { channel } = require('diagnostics_channel');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes' , (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('/api/notes' , (req, res) => {
  let notes = fs.readFileSync('./db/db.json')
  notes = JSON.parse(notes);
  res.json(notes)
})

app.post('/api/notes', (req, res) => {
  // console.log(req.body)
  let notes = fs.readFileSync('./db/db.json')
  notes = JSON.parse(notes);
  notes.push(req.body);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  notes = JSON.parse(notes);
  res.json(notes);
})

app.delete('/api/notes/:title', (req, res) => {
  
  let notes = fs.readFileSync('./db/db.json')
  notes = JSON.parse(notes);
  res.json(notes)
  console.log(notes)
  console.log(req.params);

  });

  app.get('*', (req, res) =>
  res.send(
    `Make a GET request using Insomnia to <a href="http://localhost:${PORT}/api/terms">http://localhost:${PORT}/api/terms</a>`
  )
);

app.listen(PORT, () =>
  console.log(`App sening at http://localhost:${PORT} 🚀`)
);

