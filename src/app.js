import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import fileParser from 'express-multipart-file-parser';

import apiV1 from './api/v1';

const app = express();

app.use(cors());
app.use(methodOverride());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

export default app;
