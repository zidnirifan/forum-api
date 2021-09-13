const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const expectedId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      const foundThread = await ThreadsTableTestHelper.findThreadById(
        expectedId
      );
      const expectedAddedThread = new AddedThread({
        id: expectedId,
        title: newThread.title,
        owner: newThread.owner,
      });
      expect(foundThread).toHaveLength(1);
      expect(addedThread).toStrictEqual(expectedAddedThread);
    });

    describe('isThreadExist function', () => {
      it('should throw NotFoundError when thread is not exist', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(
          threadRepositoryPostgres.isThreadExist('thread-123')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread is exist', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const threadId = 'thread-123';
        await ThreadsTableTestHelper.addThread({ id: threadId });

        await expect(
          threadRepositoryPostgres.isThreadExist(threadId)
        ).resolves.not.toThrowError(NotFoundError);
      });
    });
  });
});
