var mysql = require('mysql2');
var fs = require('fs');

var connection = mysql.createConnection(process.env.JAWSDB_URL);

fs.readFile('schema.sql', 'utf8', function(err, data) {
    if (err) throw err;
    console.log('Loaded SQL file');

    connection.query(data, function(err, results) {
        if (err) throw err;
        console.log('Executed SQL file');
    });

    connection.end();
});