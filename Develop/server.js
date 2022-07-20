const express = require('express');
const path = require('path');
const fs = require('fs');
const { channel } = require('diagnostics_channel');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

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

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/api/notes' , (req, res) => {
  let notes = fs.readFileSync('./db/db.json')
  notes = JSON.parse(notes);
  res.json(notes)
})

app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;

  if (req.body) {
    const titleId = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(titleId, './db/db.json');
    res.json('random id applied');
  } else {
    res.error('whooooops id not applied')
  }
})

app.delete('/api/notes/:id', (req, res) => {
    let notes = fs.readFileSync('./db/db.json');
    notes = JSON.parse(notes);
    res.json(notes);
    const { id } = req.params;

    notes = notes.filter(note => note.id !== id)
    console.log(notes)

    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>
      err ? console.error(err) : console.info('new array wrote')
    )
  });

  
  app.get('*', (req, res) =>
  res.send(
    `Make a GET request using Insomnia to <a href="http://localhost:${PORT}/api/terms">http://localhost:${PORT}/api/terms</a>`
  )
);

app.listen(PORT, () =>
  console.log(`App sending at http://localhost:${PORT} 🚀`)
);

