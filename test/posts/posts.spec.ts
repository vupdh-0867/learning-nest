import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setDataSource } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { create, createUser, initApp, initDataSource } from '../helper';
import { Post } from '../../src/entities/post.entity';
import { Tag } from '../../src/entities/tag.entity';
import { User } from '../../src/entities/user.entity';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let dataSource: DataSource;
  let user: User;
  const userEmail = 'phan.dang.hai.vu@sun-asterisk.com';
  const userPassword = '123456';

  beforeAll(async () => {
    app = app = await initApp();
    dataSource = await initDataSource();
    setDataSource(dataSource);
    user = await createUser(userEmail, userPassword);
  });

  describe('login to system with valid email and password to get access token', () => {
    it(`returns error`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userEmail,
          password: userPassword,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          accessToken = res.body.access_token;
        });
    });
  });

  describe('/posts', () => {
    const baseUrl = '/posts';

    describe('POST /posts', () => {
      it('return unauthorize error when not pass access_token', () => {
        return request(app.getHttpServer())
          .post(baseUrl)
          .send({
            title: 'title',
            description: 'this is description',
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.error).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Token is invalid');
            expect(res.body.statusCode).toEqual(401);
          });
      });

      it('return error create post with blank title and description', () => {
        return request(app.getHttpServer())
          .post(baseUrl)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({ title: '', tags: [{ name: 'tag1' }, { name: 'tag2' }] })
          .expect(400)
          .expect((res) => {
            expect(res.body.errors[0].error).toEqual('Bad Request');
            expect(res.body.errors[0].message).toEqual([
              'title should not be empty',
            ]);
            expect(res.body.errors[0].statusCode).toEqual(400);
          });
      });

      it('return error create post with title and description exceed max length', () => {
        return request(app.getHttpServer())
          .post(baseUrl)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            title: 'a'.repeat(256),
            description: 'a'.repeat(2001),
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.errors[0].error).toEqual('Bad Request');
            expect(res.body.errors[0].message).toEqual([
              'title must be shorter than or equal to 255 characters',
              'description must be shorter than or equal to 2000 characters',
            ]);
            expect(res.body.errors[0].statusCode).toEqual(400);
          });
      });

      it('return error create post with existed title', async () => {
        await dataSource
          .getRepository(Post)
          .save({ title: 'existed', userId: user.id });

        return request(app.getHttpServer())
          .post(baseUrl)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            title: 'existed',
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.errors[0].error).toEqual('Bad Request');
            expect(res.body.errors[0].message).toEqual([
              'Title has been taken!',
            ]);
            expect(res.body.errors[0].statusCode).toEqual(400);
          });
      });

      it('return post infor when creating post with all data are valid', async () => {
        return request(app.getHttpServer())
          .post(baseUrl)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            title: 'title',
            description: 'this is description',
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.description).toEqual('this is description');
            expect(res.body.title).toEqual('title');
            expect(
              res.body.tags.map((tag: Tag) => {
                return tag.name;
              }),
            ).toEqual(['tag1', 'tag2']);
          });
      });
    });

    describe('GET /posts', () => {
      it('return unauthorize error when not pass access_token', () => {
        return request(app.getHttpServer())
          .get(baseUrl)
          .expect(401)
          .expect((res) => {
            expect(res.body.error).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Token is invalid');
            expect(res.body.statusCode).toEqual(401);
          });
      });

      it('return all posts', async () => {
        const posts = await dataSource.getRepository(Post).find();

        return request(app.getHttpServer())
          .get(baseUrl)
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual(
              posts.map((post: Post) => {
                return {
                  description: post.description,
                  fileName: '',
                  id: post.id,
                  title: post.title,
                };
              }),
            );
          });
      });
    });

    describe('UPDATE /posts/:id', () => {
      let post: Post;

      it('return unauthorize error when not pass access_token', async () => {
        post = await create<Post>(Post, { userId: user.id });

        return request(app.getHttpServer())
          .patch(baseUrl + '/' + post.id)
          .expect(401)
          .expect((res) => {
            expect(res.body.error).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Token is invalid');
            expect(res.body.statusCode).toEqual(401);
          });
      });

      it('return updated post when update post successfully', async () => {
        post = await create<Post>(Post, { userId: user.id });
        const tag1 = await create<Tag>(Tag, { postId: post.id, name: 'tag 1' });
        await create<Tag>(Tag, { postId: post.id, name: 'tag 2' });
        const tag3 = await create<Tag>(Tag, { postId: post.id, name: 'tag 3' });

        return request(app.getHttpServer())
          .patch(baseUrl + '/' + post.id)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            title: 'new title',
            description: 'new description',
            tags: [
              { id: tag1.id, name: 'tag 01' },
              { id: tag3.id, name: 'tag 3', deleted: true },
              { name: 'tag 4' },
            ],
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toEqual(post.id);
            expect(res.body.description).toEqual('new description');
            expect(res.body.title).toEqual('new title');
            expect(
              res.body.tags.map((tag: Tag) => {
                return tag.name;
              }),
            ).toEqual(['tag 01', 'tag 2', 'tag 4']);
          });
      });
    });
  });

  afterAll(async () => {
    await dataSource.getRepository(Tag).delete({});
    await dataSource.getRepository(Post).delete({});
    await dataSource.getRepository(User).delete({});
    await app.close();
  });
});
