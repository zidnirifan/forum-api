const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when he is not owner of the reply', async () => {
      const payload = {
        owner: 'user-99',
        replyId: 'reply-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({
        owner: 'user-123',
        id: payload.replyId,
      });

      await expect(
        replyRepositoryPostgres.verifyReplyOwner(payload)
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when he is owner of the reply', async () => {
      const payload = {
        owner: 'user-123',
        replyId: 'reply-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({
        owner: payload.owner,
        id: payload.replyId,
      });

      await expect(
        replyRepositoryPostgres.verifyReplyOwner(payload)
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should update is_delete to true', async () => {
      const replyId = 'reply-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({
        id: replyId,
      });
      await replyRepositoryPostgres.deleteReply(replyId);

      const deletedReply = await RepliesTableTestHelper.findReplyById(replyId);

      expect(deletedReply[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return reply correctly', async () => {
      const commentId = 'comment-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({ commentId });

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        commentId
      );

      expect(Array.isArray(replies)).toBeTruthy();
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBeDefined();
      expect(replies[0].content).toBeDefined();
      expect(replies[0].username).toBeDefined();
      expect(replies[0].date).toBeDefined();
    });

    it('should show **balasan telah dihapus** when reply is deleted', async () => {
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({ commentId, id: replyId });
      await RepliesTableTestHelper.deleteReply(replyId);

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        commentId
      );

      expect(replies[0].content).toEqual('**balasan telah dihapus**');
      expect(Array.isArray(replies)).toBeTruthy();
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBeDefined();
      expect(replies[0].username).toBeDefined();
      expect(replies[0].date).toBeDefined();
    });

    it('should return blank array when replies not found', async () => {
      const commentId = 'thread-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        commentId
      );

      expect(replies).toEqual([]);
    });
  });
});
