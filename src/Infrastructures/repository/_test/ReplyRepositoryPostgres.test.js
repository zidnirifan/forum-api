const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'title',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const expectedId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      const foundReply = await RepliesTableTestHelper.findReplyById(expectedId);
      const expectedAddedReply = new AddedReply({
        id: expectedId,
        content: newReply.content,
        owner: newReply.owner,
      });
      expect(foundReply).toHaveLength(1);
      expect(addedReply).toStrictEqual(expectedAddedReply);
    });
  });

  describe('isReplyExist function', () => {
    it('should throw NotFoundError when reply is not exist', async () => {
      const replyId = 'reply-99';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.isReplyExist(replyId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is exist', async () => {
      const replyId = 'reply-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({ id: replyId });

      await expect(
        replyRepositoryPostgres.isReplyExist(replyId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
