import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createUser, initApp, initDataSource } from '../helper';
import { DataSource } from 'typeorm';

import { User } from '../../src/entities/user.entity';
import { setDataSource } from 'typeorm-extension';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let user: User;
  const loginPath = '/auth/login';
  const userEmail = 'test-user@sun-asterisk.com';
  const userPassword = '123456';

  beforeAll(async () => {
    app = await initApp();
    dataSource = await initDataSource();
    setDataSource(dataSource);
    user = await createUser(userEmail, userPassword);
  });

  describe('Login with invalid email', () => {
    it(`returns error`, () => {
      return request(app.getHttpServer())
        .post(loginPath)
        .send({ email: 'invalid_user@sun-asterisk.com', password: 'secret' })
        .expect(401)
        .expect((res) => {
          expect(res.body.statusCode).toEqual(401);
          expect(res.body.message).toEqual('Email or password is invalid');
          expect(res.body.error).toEqual('Unauthorized');
        });
    });
  });

  describe('Login with valid email', () => {
    it(`returns access token`, () => {
      return request(app.getHttpServer())
        .post(loginPath)
        .send({
          email: userEmail,
          password: userPassword,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await dataSource.getRepository(User).delete({});
    await app.close();
  });
});
