const { db, geoFire } = require('../lib/firebase');
const { profilePicture } = require('../lib/utils');

const user = require('../api/v1/users/model');
const place = require('../api/v1/places/model');

const locations = [
  {
    lat: 10.977597500000009,
    lng: -74.81750390624998,
    address: 'Cra. 26b #75-38, Barranquilla, Atlántico, Colombia',
    viewport: {
      northeast: {
        lat: 10.978946480291503,
        lng: -74.8160657697085,
      },
      southwest: {
        lat: 10.976248519708498,
        lng: -74.81876373029151,
      },
    },
  },
  {
    lat: 10.985662499999997,
    lng: -74.81348828125,
    address: 'Cra. 38 #74-110, Barranquilla, Atlántico, Colombia',
    viewport: {
      northeast: {
        lat: 10.987296080291504,
        lng: -74.81207566970849,
      },
      southwest: {
        lat: 10.9845981197085,
        lng: -74.81477363029151,
      },
    },
  },
  {
    lat: 10.977652499999998,
    lng: -74.81634765624999,
    address: 'Cra. 26b #74C-46, Barranquilla, Atlántico, Colombia',
    viewport: {
      northeast: {
        lat: 10.978965280291503,
        lng: -74.8148449697085,
      },
      southwest: {
        lat: 10.976267319708498,
        lng: -74.81754293029151,
      },
    },
  },
  {
    lat: 10.983452499999991,
    lng: -74.81803515624999,
    address: 'esq. Carrera 33, Cl 79 A, Barranquilla, Atlántico, Colombia',
    viewport: {
      northeast: {
        lat: 10.984658080291501,
        lng: -74.81680516970849,
      },
      southwest: {
        lat: 10.981960119708496,
        lng: -74.8195031302915,
      },
    },
  },
];

(async () => {
  const user1 = await user.createUser({
    uid: 'aiNOzljaWTWWAIKsP6ltuyZtyTX2',
    name: 'Efecty Silencio',
    nit: 123456788,
    signboard: 'Efecty test, test, test',
    phoneNumber: '+573126857641',
    location: locations[0],
    role: true,
    profilePicture,
  });

  const user2 = await user.createUser({
    uid: 'NNUqp606bgNyBemPSbBbZKLZeow1',
    name: 'CC Americano',
    nit: 123456778,
    signboard: 'Americano test, test, test',
    phoneNumber: '+573215240860',
    location: locations[1],
    role: true,
    profilePicture,
  });

  const user3 = await user.createUser({
    uid: '3',
    name: 'Olimpica Silencio',
    nit: 123456768,
    signboard: 'Olimpica test, test, test',
    phoneNumber: '+573215240861',
    location: locations[2],
    role: true,
    profilePicture,
  });

  const user4 = await user.createUser({
    uid: '4',
    name: 'Parque las Mercedes',
    nit: 123456758,
    signboard: 'Mercedes test, test, test',
    phoneNumber: '+573215240861',
    location: locations[3],
    role: true,
    profilePicture,
  });


  const place1 = await place.getOrCreatePlace(user1.id);
  const place2 = await place.getOrCreatePlace(user2.id);
  const place3 = await place.getOrCreatePlace(user3.id);
  const place4 = await place.getOrCreatePlace(user4.id);

  // const geoFire1 = await geoFire.set(user1.id, [locations[0].lat, locations[0].lng]);
  // const geoFire2 = await geoFire.set(user2.id, [locations[1].lat, locations[1].lng]);

  // geoFire.query({
  //   center: [37.42199750000001, -122.08399609374999],
  //   radius: 100,
  // }).on('key_entered', (key, location, distance) => {
  //   console.log(key, location, distance);
  // });

  console.log('RESULT', user1.id, user2.id, place1.id, place2.id);

  process.exit();
})();
