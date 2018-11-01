const express = require('express');
const bodyParser = require('body-parser');
const user = require('./server/user.js');
const db = require('./server/db.js');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(user);

app.use(function(err, req, res, next) {
  console.err(err.stack);
  res.status(500).send('Error...');
});

app.listen(app.get('port'), function() {
  console.log('server is running', app.get('port'));
});
