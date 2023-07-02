const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const cLog = require('./helpers/cLog.js'); /*for logging time*/
// Helper method for generating unique ids
const uuid = require('./helpers/uuid.js');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "clog"
app.use(clog);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//  '*' character as a wildcard to catch all routes that aren't defined:
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/404.html'))
);


app.listen(PORT, () =>
  //console.log(`App listening at http://localhost:${PORT} 🚀`)
  cLog(`App listening at http://localhost:${PORT} 🚀`)
);

