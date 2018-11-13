if (process.env.NODE_ENV !== 'production') {
  console.log('Loading .env')

  const dotenv = require('dotenv');
  dotenv.config();
}

const express = require('express');
const bodyParser = require('body-parser');
const user = require('./server/user.js');
const db = require('./server/db.js');
const update = require('./server/updateuser.js');
const content1 = require('./server/content.js');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(user);
app.use(update);
app.use(content1);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error...');
});

app.listen(app.get('port'), function() {
  console.log('server is running', app.get('port'));
});
