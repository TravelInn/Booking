require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const db = require('../database/index');
const helpers = require('./helpers');
const Promise = require('bluebird');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));
app.use('/:id', express.static(`${__dirname}/../public`));

const port = 3003;
const server = app.listen(port, () => {
  console.log(`listening in on ${port}`);
});

app.get('/api/hostels/:hostelId/reservations', (req, res) => {
  const startDate = helpers.numberDate(req.query.start);
  const endDate = helpers.numberDate(req.query.end);
  let rooms = null;

  db.getRooms(req.params.hostelId, startDate, endDate)
    .then((result) => {
      rooms = result.rows;
      return db.getBookings(req.params.hostelId, startDate, endDate);
    })
    .then((bookings) => {
      const available = helpers.filterBookings([startDate, endDate], bookings.rows, rooms);
      res.send(JSON.stringify(available));
    })
    .catch((err) => {
      console.error(err);
      res.send(JSON.stringify(err));
    });
});

app.post('/api/rooms/:roomId/bookings', (req, res) => {
  db.insertBooking(req.params.roomId, req.body.start, req.body.end)
    .then((result) => {
      console.log('inserted', result);
      res.send('inserted');
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

app.put('/api/hostels/:hostelId/reservations', (req, res) => {
  //Connect to database and do stuff
});

app.delete('/api/hostels/:hostelId/reservations', (req, res) => {
  //connect to database and do stuff
});

module.exports = server;
