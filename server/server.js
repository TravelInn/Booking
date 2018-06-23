const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db.js');
const morgan = require('morgan');
const cors = require('cors');

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
  // db.serveHotel(req.params.hostelId, (err, data) => {
  //   if (err) console.log('there was an error', err);
  //   else res.send(data);
  // });
  const fakeData = {
    rooms: [
      {
        room: [
          {
            price: 10,
            maxBeds: 10,
            date: '2018-06-18',
            bedsLeft: 3,
          },
        ],
      },
      {
        room: [
          {
            price: 5,
            maxBeds: 5,
            date: '2018-06-18',
            bedsLeft: 2,
          },
        ],
      },
    ],
  };
  res.send(JSON.stringify(fakeData));
});

module.exports = server;
