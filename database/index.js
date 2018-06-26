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
    'SELECT foo.id, foo.price, foo.beds, bookings.startdate, bookings.enddate FROM (select * from rooms WHERE hostel_id=$1) AS foo JOIN bookings ON foo.id=bookings.room_id WHERE (bookings.startdate<=$3 AND bookings.startdate>=$2) OR (bookings.enddate<=$3 AND bookings.enddate>=$2)',
    [id, start, end],
  );
