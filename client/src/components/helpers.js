const numberDate = (date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const dateArr = date.split('-');
  const first = new Date('2018', '06', '19');
  const last = new Date(dateArr[0], dateArr[1], dateArr[2]);
  return Math.round(Math.abs((first.getTime() - last.getTime()) / (oneDay)));
};

const arrOfZeros = (n) => {
  const arr = [];
  for (let i = 0; i < n; i += 1) {
    arr.push(0);
  }
  return arr;
};

const getStartIndex = (currStart, bookStart) => {
  if (bookStart < currStart) {
    return 0;
  }
  return bookStart - currStart;
};

const getEndIndex = (currStart, currEnd, bookEnd) => {
  if (bookEnd > currEnd) {
    return (currEnd - currStart);
  }
  return (bookEnd - currStart);
};

const isRoomAvailable = (newBook, room) => {
  if (!room.bookings) {
    return true;
  }
  const { beds } = room;
  const arr = arrOfZeros(newBook[1] - newBook[0]);
  for (let i = 0; i < room.bookings.length; i += 1) {
    const startIndex = getStartIndex(newBook[0], room.bookings[i][0]);
    const endIndex = getEndIndex(newBook[0], newBook[1], room.bookings[i][1]);
    for (let j = startIndex; j <= endIndex; j += 1) {
      arr[j] += 1;
      if (arr[j] >= beds) {
        return false;
      }
    }
  }
  return true;
};

const convertRoom = (room) => {
  const data = {
    room: [
      {
        price: room.price,
        maxBeds: room.beds,
        date: '2018-06-19',
        bedsLeft: room.beds,
      },
    ],
  };
  return data;
};

const filterBookings = (bookDate, bookings, rooms) => {
  const allRooms = {};
  for (let i = 0; i < rooms.length; i += 1) {
    allRooms[rooms[i].id] = rooms[i];
  }
  for (let i = 0; i < bookings.length; i += 1) {
    if (allRooms[bookings[i].id].bookings === undefined) {
      allRooms[bookings[i].id].bookings = [];
    }
    allRooms[bookings[i].id].bookings.push([bookings[i].startdate, bookings[i].enddate]);
  }

  const available = {
    rooms: [],
  };
  const keys = Object.keys(allRooms);
  for (let i = 0; i < keys.length; i += 1) {
    if (isRoomAvailable(bookDate, allRooms[keys[i]])) {
      available.rooms.push(convertRoom(allRooms[keys[i]]));
    }
  }
  return available;
};

module.exports.numberDate = numberDate;
module.exports.filterBookings = filterBookings;
