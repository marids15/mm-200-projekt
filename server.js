// to run local test environments
if (process.env.NODE_ENV !== 'production') {
  console.log('Loading .env')

  const dotenv = require('dotenv');
  dotenv.config();
}

const express = require('express');
const bodyParser = require('body-parser');
const user = require('./server/user.js');
const db = require('./server/db.js');
const presentation = require('./server/presentations.js');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(user);
app.use(presentation);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error...');
});

app.listen(app.get('port'), function() {
  console.log('server is running', app.get('port'));
});
