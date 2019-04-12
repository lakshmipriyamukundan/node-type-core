const user = {
  firstName: 'Foo',
  lastName: 'Bar',
  age: 50,
  email: 'foo@bar.com',
};

const { firstName, lastName } = user;

console.log('f, l', firstName, lastName);

const { age, ...userWithoutPII } = user;

console.log('age, userWithoutAge', age, userWithoutPII, user);
