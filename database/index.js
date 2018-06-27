const { Client } = require('pg');

const client = new Client({
  database: 'travelinn',
});

client.connect();

module.exports.getRooms = id =>
  client.query(
    'SELECT * FROM rooms WHERE hostel_id=$1',
    [id],
  );

module.exports.getBookings = (id, start, end) =>
  client.query(
    'SELECT foo.id, foo.price, foo.beds, bookings.startdate, bookings.enddate FROM (SELECT (id, price, beds) FROM rooms WHERE hostel_id=$1) AS foo JOIN bookings ON foo.id=bookings.room_id WHERE (bookings.startdate<=$3 AND bookings.startdate>=$2) OR (bookings.enddate<=$3 AND bookings.enddate>=$2)',
    [id, start, end],
  );

module.exports.insertBooking = (roomId, start, end) =>
  client.query(
    'INSERT INTO bookings (room_id, startdate, enddate) VALUES ($1, $2, $3)',
    [roomId, start, end],
  );
