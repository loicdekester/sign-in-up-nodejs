const User = require("../models/User");
const { db } = require('../repository/index');

before(async () => {
  await db.users.create();
  const mockUser = new User;
  mockUser.firstName = "John";
  mockUser.lastName = "Doe";
  mockUser.email = "john.doe@test.com";
  await mockUser.setEncryptedPassword("password");
  await db.users.add(mockUser);
});

after(() => {
  db.users.drop()
});
