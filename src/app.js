const express = require('express');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const router = require('./routes/router');
const { PORT } = require('./environments');
const cors = require('cors');
const createError = require('http-errors');
require('dotenv').config()
const { WHITELIST } = require('./environments');

const app = express()
const log = fs.createWriteStream(
  path.join(__dirname, "../logs", `express${moment().format('YYYY-MM-DD')}.log`), { flags: "a" }
);

const corsOptions = {
  origin: function (origin, callback) {
    if (WHITELIST.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(createError.Unauthorized('Not allowed by CORS'))
    }
  }
}

morganBody(app, {
  noColors: true,
  stream: log,
});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(router);
  
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))