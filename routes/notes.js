const notes = require('express').Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const cLog = require('../helpers/cLog'); /*for logging time*/
const mysql = require('mysql2');


// Connect to database
/*const db = mysql.createConnection(
  {
  host: 'localhost',
  // MySQL username,
  user: 'root',
  // MySQL password
  password: '',
  database: 'note_db'
  },
  console.log(`Connected to the notes_db database.`)
);*/

//const mysql = require('mysql');
const url = require('url');

let db;

if (process.env.JAWSDB_URL) {
  // Heroku deployment
  const connectionURL = url.parse(process.env.JAWSDB_URL);
  const connectionAuth = connectionURL.auth.split(':');

  db = mysql.createConnection({
    host: connectionURL.hostname,
    user: connectionAuth[0],
    password: connectionAuth[1],
    database: connectionURL.path.substr(1)
  });
} else {
  // local host
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'note_db'
  });
}

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database.");
});



// API!
// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  // Log our request to the terminal
  cLog(`${req.method} request received to get notes`);

  // Obtain the existing notes:
  /*fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);

      const response = notes;

      res.status(201).json(response);
    } 
  });*/
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM notes', function (err, results) {
        if (err) {
            reject(err);
        } else {
          //console.log(results);
          //let notes = JSON.parse(results);

          //console.log(notes);
          const response = results;
    
          res.status(201).json(response);
          resolve();
        }
    });
});
});


// POST request to add a new Note
notes.post('/', (req, res) => {
  // Log that a POST request was received
  cLog(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      //id: uuid(),
    };

    // Obtain the existing notes:
    /*fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let notes = JSON.parse(data);

        notes.push(newNote); 

        fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, 2), (err) =>
        err
          ? console.error(err)
          : cLog(
              `Note for ${newNote.title} has been added to JSON file`
            )
        );        
      }
    })*/
    const sql = `INSERT INTO notes (title, text) VALUES (?, ?)`;
    const params = [title, text];

    db.query(sql, params, function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Added ${title} to the notes table.`);
        }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});


// DELETE request to delete a Note
notes.delete('/:id', (req, res) => {
  // Log that a POST request was received
  cLog(`${req.method} request received to delete a note`);

  const id = req.params.id;

  // make sure id is found to delete
  if (id) {

    // Obtain the existing notes:
    /*fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let notes = JSON.parse(data);

        var deleteNoteTitle = ""; 
        //find the corresponding note:
        let index = notes.findIndex(item => item.id === id);        
        // if the object was found in the array, remove it
        if (index !== -1) {
          deleteNoteTitle = notes[index].title;
          notes.splice(index, 1);
        }

        fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, 2), (err) =>
        err
          ? console.error(err)
          : cLog(
              `Note for ${deleteNoteTitle} with id ${id} has been deleted`
            )
      );        
      }
    })*/
    const sql = `DELETE FROM notes WHERE id = ?`
    const params = id;

    db.query(sql, params, function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Deleted ${id} from notes`);
        }
    });


    const response = {
      status: 'success',
      body: id,
    };

    //console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in deleting note');
  }
});

// UPDATE request to upate a Note
notes.put('/:id', (req, res) => {
  // Log that a POST request was received
  cLog(`${req.method} request received to update a note`);

  const id = req.params.id;
  const { title, text } = req.body;

  // make sure id is found to delete
  if (id) {

    // Obtain the existing notes:
    /*fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let notes = JSON.parse(data);

        //find the corresponding note:
        let index = notes.findIndex(item => item.id === id);        
        // if the object was found in the array, update the note
        if (index !== -1) {
          notes[index].title = title;
          notes[index].text = text
        }

        fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, 2), (err) =>
        err
          ? console.error(err)
          : cLog(
              `Note for ${title} with id ${id} has been updated`
            )
      );        
      }
    })*/
    const sql = `UPDATE notes SET title = ?, text = ? WHERE id = ?`;
    const params = [title, text, id];

    db.query(sql, params, function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Updated ${title} notes`);
        }
    });

    const response = {
      status: 'success',
      body: id,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in deleting note');
  }
});







module.exports = notes;
