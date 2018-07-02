require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const db = require('../database/index');
const helpers = require('./helpers');

const get = (req, res) => {
  const startDate = helpers.numberDate(req.query.start);
  const endDate = helpers.numberDate(req.query.end);
  let rooms = null;
  db.getRooms(req.params.hostelId)
    .then((result) => {
      rooms = result.rows;
      return db.getBookings(req.params.hostelId, startDate, endDate);
    })
    .then((bookings) => {
      const available = helpers.filterBookings([startDate, endDate], bookings.rows, rooms);
      res.send(JSON.stringify(available));
    })
    .catch((err) => {
      res.statusCode = 503;
      res.send(JSON.stringify(err));
    });
};

const post = (req, res) => {
  db.insertBooking(req.params.roomId, req.body.start, req.body.end)
    .then((result) => {
      res.send(JSON.stringify(result));
    })
    .catch((err) => {
      res.statusCode = 503;
      res.send(JSON.stringify(err));
    });
};

const app = express();

app.use(morgan('tiny'));

app.get('/api/hostels/:hostelId/reservations', get);

app.use(bodyParser.json());

app.post('/api/rooms/:roomId/bookings', post);

app.use(express.static(`${__dirname}/../public`));

app.use('/:id', express.static(`${__dirname}/../public`));

app.post('/api/loaderio', (req, res) => {
  const verification = req.body.loader;
  fs.writeFile(`${__dirname}/../public/${verification}.txt`, verification, (err) => {
    if (err) console.error(err);
  });
  res.send();
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`listening in on ${port}`);
});
