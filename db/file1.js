var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');  // Import the path module

var connection = mysql.createConnection(process.env.JAWSDB_URL);

// Use path.join to create a path that's relative to the current script file
var sqlFilePath = path.join(__dirname, 'schema.sql');

fs.readFile(sqlFilePath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('Loaded SQL file');

    // Split data into individual queries
    var queries = data.split(';').map(function(query) {
        return query.trim();  // Trim whitespace
    }).filter(function(query) {
        return query.length > 0;  // Filter out empty queries
    });

    // Execute each query one by one
    var index = 0;
    function executeNextQuery() {
        if (index >= queries.length) {
            console.log('Executed all SQL commands');
            connection.end();
            return;
        }

        var query = queries[index++];
        console.log('Executing query:', query);
        connection.query(query, function(err, results) {
            if (err) throw err;
            console.log('Executed SQL command');
            executeNextQuery();  // Proceed to next query
        });
    }

    executeNextQuery();  // Start executing queries
});
