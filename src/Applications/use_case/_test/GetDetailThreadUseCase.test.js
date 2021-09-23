const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    const threadId = 'thread-123';
    const expectedDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    };
    const expectedComments = [
      {
        id: 'comment-99',
        username: 'johndoe',
        date: new Date(),
        content: 'sebuah comment',
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'user',
        date: new Date(),
        content: 'balasan',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyReposiotry = new ReplyRepository();

    mockThreadRepository.getDetailThreadById = jest.fn(() =>
      Promise.resolve(expectedDetailThread)
    );
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve(expectedComments)
    );
    mockReplyReposiotry.getRepliesByCommentId = jest.fn(() =>
      Promise.resolve(expectedReplies)
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyReposiotry,
    });

    const detailThread = await getDetailThreadUseCase.execute(threadId);

    const commentsMapped = expectedComments.map((comment) => ({
      ...comment,
      replies: expectedReplies,
    }));

    expect(detailThread).toStrictEqual({
      ...new DetailThread({
        ...expectedDetailThread,
        comments: commentsMapped,
      }),
    });
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockReplyReposiotry.getRepliesByCommentId).toBeCalledTimes(1);
  });
});
