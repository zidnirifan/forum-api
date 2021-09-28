class LikeUnlikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { commentId, userId, threadId } = payload;
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);
    const isCommentLiked = await this._commentRepository.isCommentLiked({
      commentId,
      userId,
    });

    if (isCommentLiked) {
      await this._commentRepository.unlikeComment({ commentId, userId });
    } else {
      await this._commentRepository.likeComment({ commentId, userId });
    }
  }

  _verifyPayload({ userId, commentId, threadId }) {
    if (!userId || !commentId || !threadId) {
      throw new Error(
        'LIKE_UNLIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }

    if (
      typeof userId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error(
        'LIKE_UNLIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = LikeUnlikeCommentUseCase;
