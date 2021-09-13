const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 status code and added comment', async () => {
      const requestPayload = {
        content: 'comment',
      };
      const threadId = 'thread-123';

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it(`should response 401 status code and show Missing Authentication message
      when miss authentication`, async () => {
      const requestPayload = {
        content: 'comment',
      };
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 status code when thread is not exist', async () => {
      const requestPayload = {
        content: 'comment',
      };
      const accessToken = await ServerTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/123/comments`,
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 status code when request payload not contain needed property', async () => {
      const requestPayload = {};
      const threadId = 'thread-123';

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 status code when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: 123,
      };
      const threadId = 'thread-123';

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const server = await createServer(container);

      const response = await server.inject({
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat menambahkan comment baru karena tipe data tidak sesuai'
      );
    });
  });
});
