db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('people');

db.people.insert({ name: "Name Surname", number: "123-4578671" });
db.people.insert({ name: "Name Surname1", number: "123-4578672" });
db.people.insert({ name: "Name Surname2", number: "123-4578673" });
db.people.insert({ name: "Name Surname3", number: "123-4578674" });