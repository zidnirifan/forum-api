const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const payload = {
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'thread-123',
      content: payload.content,
      owner: payload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(payload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(payload)
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
  });
});
