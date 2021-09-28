const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    const detailThread = await this._threadRepository.getDetailThreadById(
      threadId
    );
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentsWithRepliesAndLikeCount = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        replies: await this._replyRepository.getRepliesByCommentId(comment.id),
        likeCount: await this._commentRepository.getLikeCountByCommentId(
          comment.id
        ),
      }))
    );

    return {
      ...new DetailThread({
        ...detailThread,
        comments: commentsWithRepliesAndLikeCount,
      }),
    };
  }
}

module.exports = GetDetailThreadUseCase;
