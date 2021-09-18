const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      replyId: 'reply-123',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      owner: true,
      replyId: 123,
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const payload = {
      owner: 'user-123',
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(payload);

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      payload.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(payload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      replyId: payload.replyId,
      owner: payload.owner,
    });
    expect(mockReplyRepository.deleteReply).toBeCalledWith(payload.replyId);
  });
});
