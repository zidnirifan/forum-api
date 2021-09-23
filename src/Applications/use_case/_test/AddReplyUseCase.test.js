const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const payload = {
      content: 'reply',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner: payload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(expectedAddedReply)
    );
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(payload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(payload));
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      payload.commentId
    );
  });
});
