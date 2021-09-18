const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      const newComment = new NewComment({
        content: 'title',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const expectedId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      const foundComment = await CommentsTableTestHelper.findCommentById(
        expectedId
      );
      const expectedAddedComment = new AddedComment({
        id: expectedId,
        content: newComment.content,
        owner: newComment.owner,
      });
      expect(foundComment).toHaveLength(1);
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('isCommentExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      const commentId = 'comment-99';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.isCommentExist(commentId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exist', async () => {
      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ id: commentId });

      await expect(
        commentRepositoryPostgres.isCommentExist(commentId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when he is not owner of the comment', async () => {
      const payload = {
        owner: 'user-99',
        commentId: 'comment-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        owner: 'user-123',
        id: 'comment-123',
      });

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(payload)
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when he is owner of the comment', async () => {
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment(payload);

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(payload)
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete to true', async () => {
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment(payload);
      await commentRepositoryPostgres.deleteComment(payload.commentId);

      const deletedComment = await CommentsTableTestHelper.findCommentById(
        payload.commentId
      );

      expect(deletedComment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentById', () => {
    it('should return comment correctly', async () => {
      const threadId = 'thread-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ threadId });

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      expect(Array.isArray(comments)).toBeTruthy();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
    });

    it('should show **komentar telah dihapus** when comment is deleted', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ threadId, id: commentId });
      await CommentsTableTestHelper.deleteComment(commentId);

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      expect(comments[0].content).toEqual('**komentar telah dihapus**');
      expect(Array.isArray(comments)).toBeTruthy();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
    });

    it('should return blank array when comments not found', async () => {
      const threadId = 'thread-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      expect(comments).toEqual([]);
    });
  });
});
