const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UserCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 status code and added thread', async () => {
      const requestPayload = {
        title: 'title',
        body: 'body',
      };

      const accessToken = await ServerTestHelper.getAccessToken({});

      const server = await createServer(container);

      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it(`should response 401 status code and show Missing Authentication message
      when miss authentication`, async () => {
      const requestPayload = {
        title: 'title',
        body: 'body',
      };

      const server = await createServer(container);

      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 status code when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'title',
      };

      const accessToken = await ServerTestHelper.getAccessToken({});

      const server = await createServer(container);

      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menambahkan thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 status code when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 123,
        body: true,
      };

      const accessToken = await ServerTestHelper.getAccessToken({});

      const server = await createServer(container);

      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menambahkan thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 400 status code when title more than 100 character', async () => {
      const requestPayload = {
        title:
          'juduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljudul',
        body: 'body',
      };

      const accessToken = await ServerTestHelper.getAccessToken({});

      const server = await createServer(container);

      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      );
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and detail thread', async () => {
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const threadId = 'thread-123';

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when GET /threads/{threadId} after thread commented', () => {
    it('should response 200 and correct property and value', async () => {
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ threadId });
      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);
      const { comments } = responseJson.data.thread;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId} after comment thread replied', () => {
    it('should response 200 and correct property and value', async () => {
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ threadId });
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);
      const { comments } = responseJson.data.thread;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].replies).toBeDefined();
      expect(comments[0].replies).toHaveLength(1);
    });
  });

  describe('when GET /threads/{threadId} after comment thread liked', () => {
    it('should response 200 and correct property and value', async () => {
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ threadId });
      await UserCommentLikesTableTestHelper.likeComment({});
      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}`,
        method: 'GET',
      });

      const responseJson = JSON.parse(response.payload);
      const { comments } = responseJson.data.thread;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].likeCount).toBeDefined();
      expect(comments[0].likeCount).toEqual(1);
    });
  });
});
