require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const cors = require('cors');
const db = require('../database/index');
const helpers = require('./helpers');

const get = (req, res) => {
  const startDate = helpers.numberDate(req.query.start);
  const endDate = helpers.numberDate(req.query.end);
  let rooms = null;
  db.getRooms(req.params.hostelId)
    .then((result) => {
      console.log('got rooms!', result.rows);
      rooms = result.rows;
      return db.getBookings(req.params.hostelId, startDate, endDate);
    })
    .then((bookings) => {
      console.log('got bookings!');
      const available = helpers.filterBookings([startDate, endDate], bookings.rows, rooms);
      res.send(JSON.stringify(available));
    })
    .catch((err) => {
      res.statusCode = 503;
      console.log(err);
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

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(express.static(`${__dirname}/../public`));
  app.use('/:id', express.static(`${__dirname}/../public`));

  app.get('/api/hostels/:hostelId/reservations', get);

  app.post('/api/rooms/:roomId/bookings', post);

  app.put('/api/hostels/:hostelId/reservations', (req, res) => {
    //Connect to database and do stuff
  });

  app.delete('/api/hostels/:hostelId/reservations', (req, res) => {
    //connect to database and do stuff
  });
  return app;
};

const app = createApp();
// const app2 = createApp();

const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`listening in on ${port}`);
});
// const port2 = 4002;
// const server2 = app2.listen(port2, () => {
//   console.log(`listening in on ${port2}`);
// });

// const servers = ['http://localhost:4001', 'http://localhost:4002'];

// let cur = 0;

// const handler = (req, res) => {
//   req.pipe(request({ url: servers[cur] + req.url })).pipe(res);
//   cur = (cur + 1) % servers.length;
// };

// const loader = express();

// loader.get('*', handler);
// loader.post('*', handler);
// const server = loader.listen(3003);

module.exports = server;
