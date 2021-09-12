const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

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
    it('should persist new thread and return added thread correctly', async () => {
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
});
