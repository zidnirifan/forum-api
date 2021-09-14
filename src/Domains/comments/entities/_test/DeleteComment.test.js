const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      owner: true,
      commentId: 123,
      threadId: 'thread-123',
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DeleteComment object correctly', () => {
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const { commentId, owner, threadId } = new DeleteComment(payload);

    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
  });
});
