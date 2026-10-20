import { faker } from '@faker-js/faker';

export const RandomData = {
  email: () => faker.internet.email(),
  password: () => `Test@${faker.number.int({ min: 1000, max: 9999 })}`,
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  fullName: () => faker.person.fullName(),
  phone: () => faker.phone.number({ style: 'national' }),
  address: () => faker.location.streetAddress(),
  city: () => faker.location.city(),
  state: () => faker.location.state(),
  zipCode: () => faker.location.zipCode(),
  country: () => faker.location.country(),
  companyName: () => faker.company.name(),
};
