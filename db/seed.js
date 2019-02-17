const { db, geoFire } = require('../lib/firebase');
const { defaultProfilePicture, emptyImg } = require('../lib/utils');

const User = require('../api/v1/users/model');
const Place = require('../api/v1/places/model');
const UsersPlaces = require('../api/v1/usersPlaces/model');

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

const closingTime = {
  hourOfDay: 19,
  minute: 56,
};

const openingTime = {
  hourOfDay: 6,
  minute: 30,
};

(async () => {
  const user1 = await User.createUser({
    uid: 'aiNOzljaWTWWAIKsP6ltuyZtyTX2',
    name: 'Efecty Silencio',
    phoneNumber: '+573126857641',
    location: locations[0],
    role: true,
    profilePicture: defaultProfilePicture,
  });

  const user2 = await User.createUser({
    uid: 'NNUqp606bgNyBemPSbBbZKLZeow1',
    name: 'CC Americano',
    phoneNumber: '+573215240860',
    location: locations[1],
    role: true,
    profilePicture: defaultProfilePicture,
  });

  const user3 = await User.createUser({
    uid: '3',
    name: 'Olimpica Silencio',
    phoneNumber: '+573215240861',
    location: locations[2],
    role: true,
    profilePicture: defaultProfilePicture,
  });

  const user4 = await User.createUser({
    uid: '4',
    name: 'Parque las Mercedes',
    phoneNumber: '+573215240861',
    location: locations[3],
    role: true,
    profilePicture: defaultProfilePicture,
  });

  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac lectus nulla. Aliquam erat volutpat. Nunc non iaculis justo. Mauris nec neque volutpat, varius magna in, placerat odio. Mauris blandit facilisis lorem et facilisis. Duis ut urna vel neque rhoncus faucibus a et arcu. Etiam nisl arcu, ultrices volutpat tristique in, consequat quis tellus.';

  const place1 = await Place.createOrUpdatePlace(user1.id, {
    nit: 123456781,
    signboard: 'Efecty test, test, test',
    images: [emptyImg, emptyImg, emptyImg, emptyImg],
    stories: [emptyImg, emptyImg, emptyImg, emptyImg],
    openingTime,
    closingTime,
    description,
    category: 'Aeropuerto',
  });
  const place2 = await Place.createOrUpdatePlace(user2.id, {
    nit: 123456782,
    signboard: 'Americano test, test, test',
    images: [emptyImg, emptyImg, emptyImg, emptyImg],
    stories: [emptyImg, emptyImg, emptyImg, emptyImg],
    openingTime,
    closingTime,
    description,
    category: 'Aeropuerto militar',
  });
  const place3 = await Place.createOrUpdatePlace(user3.id, {
    nit: 123456783,
    signboard: 'Olimpica test, test, test',
    images: [emptyImg, emptyImg, emptyImg, emptyImg],
    stories: [emptyImg, emptyImg, emptyImg, emptyImg],
    openingTime,
    closingTime,
    description,
    category: 'Agencia de espectáculos',
  });
  const place4 = await Place.createOrUpdatePlace(user4.id, {
    nit: 123456784,
    signboard: 'Mercedes test, test, test',
    images: [emptyImg, emptyImg, emptyImg, emptyImg],
    stories: [emptyImg, emptyImg, emptyImg, emptyImg],
    openingTime,
    closingTime,
    description,
    category: 'Agencia de excursiones',
  });

  // const geoFire1 = await geoFire.set(user1.id, [locations[0].lat, locations[0].lng]);
  // const geoFire2 = await geoFire.set(user2.id, [locations[1].lat, locations[1].lng]);

  // geoFire.query({
  //   center: [37.42199750000001, -122.08399609374999],
  //   radius: 100,
  // }).on('key_entered', (key, location, distance) => {
  //   console.log(key, location, distance);
  // });

  // console.log('RESULT', user1.id, user2.id, place1.id, place2.id);

  // const response = await UsersPlaces.rejectedPlaces('ELP5rre9W5T2cy743aIQ');

  console.log('RESULTS', place1.id, place2.id, place3.id, place4.id);

  process.exit();
})();
