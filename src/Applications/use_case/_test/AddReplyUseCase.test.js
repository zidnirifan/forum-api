const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const payload = {
      content: 'reply',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner: payload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    const addedReply = await addReplyUseCase.execute(payload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(payload));
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      payload.commentId
    );
  });
});
