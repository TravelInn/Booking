const faker = require('faker');
const db = require('./db');

const randomizeNumber = function (min, max) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
};

const sequentialDate = function (next) {
  const today = new Date();
  today.setDate(today.getDate() + next);
  let day = today.getDate();
  if (day < 10) day = `0${day}`;
  let month = today.getMonth();
  if (month < 10) month = `0${month}`;
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

const randomRoom = function () {
  console.log('random room was called');
  const hotels = 100;
  const record = 0;
  while (hotels > 0) {
    const rooms = 10;
    while (rooms > 0) {
      const randomName = faker.name.findName();
      const daysAhead = 30;
      const maxBeds = randomizeNumber(1, 11);
      while (daysAhead > 0) {
        const currentRoom = {};
        currentRoom.record = record;
        currentRoom.hotelId = hotels;
        currentRoom.roomId = rooms;
        currentRoom.roomName = randomName;
        currentRoom.maxBeds = maxBeds;
        currentRoom.reservedBeds = randomizeNumber(0, maxBeds + 1);
        currentRoom.price = randomizeNumber(5, (maxBeds * 2));
        currentRoom.date = sequentialDate(daysAhead);
        db.save(currentRoom);
        daysAhead - 1;
        record + 1;
      }
      rooms - 1;
    }
    hotels - 1;
  }
};

module.exports.randomRoom = randomRoom;