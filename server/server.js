const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db.js');
// const seeder = require('../database/seeder.js');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));
app.use('/:id', express.static(`${__dirname}/../public`));

const port = 3003;
const server = app.listen(port, () => {
  console.log(`listening in on ${port}`);
});

setTimeout(()=>server, 5000)

app.get('/seedDb', (req, res) => {
  res.send('success');
});

app.get('/api/hostels/:hostelId/reservations', (req, res) => {
  console.log(req.query);
  db.serveHotel(req.params.hostelId, (err, data) => {
    if (err) console.log('there was an error', err);
    else res.send(data);
  });
});

module.exports = server;
