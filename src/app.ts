import express from 'express';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import router from './routes/router';
import { PORT } from './environments';
const cors = require('cors');
import { WHITELIST } from './environments';
import createError from 'http-errors';
require('dotenv').config();
const app = express();

const log = fs.createWriteStream(
  path.join(
    __dirname,
    '../logs',
    `express${moment().format('YYYY-MM-DD')}.log`
  ),
  { flags: 'a' }
);

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (WHITELIST?.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(createError.Unauthorized('Not allowed by CORS'));
    }
  },
};

morganBody(app, {
  noColors: true,
  stream: log,
});

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(router);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
