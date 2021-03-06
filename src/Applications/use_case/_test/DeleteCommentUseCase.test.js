const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      commentId: 'comment-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      owner: true,
      commentId: 123,
      threadId: 'thread-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(payload);

    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      payload.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      payload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
      commentId: payload.commentId,
      owner: payload.owner,
    });
  });
});
