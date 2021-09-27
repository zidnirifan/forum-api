const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersCommentLikesTableTestHelper.cleanTable();
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
      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ id: commentId });
      await commentRepositoryPostgres.deleteComment(commentId);

      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId
      );

      expect(deletedComment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId', () => {
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

    it('should return blank array when comments not found', async () => {
      const threadId = 'thread-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      expect(comments).toEqual([]);
    });
  });

  describe('isCommentLiked function', () => {
    it('should return true when comment is liked', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ id: commentId });
      await UsersCommentLikesTableTestHelper.likeComment({ commentId, userId });

      const isCommentLiked = await commentRepositoryPostgres.isCommentLiked({
        commentId,
        userId,
      });

      expect(isCommentLiked).toBeTruthy();
    });

    it('should return false when comment is not liked', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const isCommentLiked = await commentRepositoryPostgres.isCommentLiked({
        commentId,
        userId,
      });

      expect(isCommentLiked).toBeFalsy();
    });
  });

  describe('likeComment function', () => {
    it('should add commentId and userId to user_comment_likes table', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';

      const fakeIdGenerator = () => '123';
      const expectedId = 'comment-like-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await CommentsTableTestHelper.addComment({ id: commentId });

      await commentRepositoryPostgres.likeComment({
        commentId,
        userId,
      });

      const foundAddedLike =
        await UsersCommentLikesTableTestHelper.findLikeCommentById(expectedId);

      expect(foundAddedLike).toHaveLength(1);
      expect(foundAddedLike[0].id).toEqual(expectedId);
      expect(foundAddedLike[0].comment_id).toEqual(commentId);
      expect(foundAddedLike[0].user_id).toEqual(userId);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete liked comment from user_comment_likes table', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const likedCommentId = 'comment-like-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ id: commentId });
      await UsersCommentLikesTableTestHelper.likeComment({
        commentId,
        userId,
        id: likedCommentId,
      });

      await commentRepositoryPostgres.unlikeComment({
        commentId,
        userId,
      });

      const likedComment =
        await UsersCommentLikesTableTestHelper.findLikeCommentById(
          likedCommentId
        );

      expect(likedComment).toHaveLength(0);
    });
  });
});
