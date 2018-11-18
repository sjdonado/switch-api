const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileParser = require('express-multipart-file-parser');

const apiV1 = require('./api/v1');
const { authentication } = require('./api/v1/lib/auth');

const app = express();

app.use(cors());
app.use(methodOverride());

app.use(authentication);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileParser);

app.use('/api/v1', apiV1);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: {
      code: 404,
      message: 'Not found',
    },
  });
});

app.use((err, req, res) => {
  let {
    statusCode = 500, message,
  } = err;

  switch (err.type) {
    case 'entity.parse.failed':
      message = `Bad Request: ${err.message}`;
      break;
    default:
      if (err.message.startsWith('ValidationError')) {
        statusCode = 422;
      }
      break;
  }

  res.status(statusCode);
  res.json({
    error: {
      code: statusCode,
      message,
    },
  });
});

module.exports = app;
