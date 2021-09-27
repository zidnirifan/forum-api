const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeUnlikeCommentUseCase = require('../LikeUnlikeCommentUseCase');

describe('LikeUnlikeCommentUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      commentId: 'comment-123',
    };

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({});

    await expect(
      likeUnlikeCommentUseCase.execute(payload)
    ).rejects.toThrowError(
      'LIKE_UNLIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      userId: true,
      commentId: 123,
      threadId: 'thread-123',
    };

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({});

    await expect(
      likeUnlikeCommentUseCase.execute(payload)
    ).rejects.toThrowError(
      'LIKE_UNLIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the like comment action correctly when comment is not liked', async () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const { userId, commentId, threadId } = payload;

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.isCommentLiked = jest.fn(() =>
      Promise.resolve(false)
    );
    mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve());

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeUnlikeCommentUseCase.execute(payload);

    expect(mockCommentRepository.isCommentLiked).toBeCalledWith(commentId);
    expect(mockCommentRepository.likeComment).toBeCalledWith({
      commentId,
      userId,
    });
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(commentId);
  });

  it('should orchestrating the unlike comment action correctly when comment is already liked', async () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const { userId, commentId, threadId } = payload;

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.isCommentLiked = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve());

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeUnlikeCommentUseCase.execute(payload);

    expect(mockCommentRepository.isCommentLiked).toBeCalledWith(commentId);
    expect(mockCommentRepository.unlikeComment).toBeCalledWith({
      commentId,
      userId,
    });
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(commentId);
  });
});
