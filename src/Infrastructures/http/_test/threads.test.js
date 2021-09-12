const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

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

      const accessToken = await ServerTestHelper.getAccessToken();

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

      const accessToken = await ServerTestHelper.getAccessToken();

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

    it('should response 400 status code when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 123,
        body: true,
      };

      const accessToken = await ServerTestHelper.getAccessToken();

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

    it('should response 400 status code when title more than 100 character', async () => {
      const requestPayload = {
        title:
          'juduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljuduljudul',
        body: 'body',
      };

      const accessToken = await ServerTestHelper.getAccessToken();

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
});
