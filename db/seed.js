const { db, geoFire } = require('../lib/firebase');
const user = require('../api/v1/users/model');
const place = require('../api/v1/places/model');

const locations = [
  {
    lat: 37.42892081,
    lng: -122.08273889,
  },
  {
    lat: 37.43297251,
    lng: -122.11925736,
  },
];

(async () => {
  const user1 = await user.getOrCreateUser({
    uid: 'aiNOzljaWTWWAIKsP6ltuyZtyTX2',
    phone_number: '+573126857641',
    location: locations[0],
  });

  const user2 = await user.getOrCreateUser({
    uid: 'NNUqp606bgNyBemPSbBbZKLZeow1',
    phone_number: '+573215240860',
    location: locations[1],
  });


  const place1 = await place.getOrCreatePlace({
    userId: user1.id,
  });

  const place2 = await place.getOrCreatePlace({
    userId: user2.id,
  });

  const geoFire1 = await geoFire.set(user1.id, [locations[0].lat, locations[0].lng]);
  const geoFire2 = await geoFire.set(user2.id, [locations[1].lat, locations[1].lng]);

  // geoFire.query({
  //   center: [37.42199750000001, -122.08399609374999],
  //   radius: 100,
  // }).on('key_entered', (key, location, distance) => {
  //   console.log(key, location, distance);
  // });

  console.log('RESULT', user1.id, user2.id, place1.id, place2.id);
  process.exit();
})();
