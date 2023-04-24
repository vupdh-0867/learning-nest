import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { User } from '../../entities/user.entity';

export default setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  return user;
});
