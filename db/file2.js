var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');  // Import the path module

var connection = mysql.createConnection(process.env.JAWSDB_URL);

// Use path.join to create a path that's relative to the current script file
var sqlFilePath = path.join(__dirname, 'seeds.sql');

fs.readFile(sqlFilePath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('Loaded SQL file');

    connection.query(data, function(err, results) {
        if (err) throw err;
        console.log('Executed SQL file');
    });

    connection.end();
});
