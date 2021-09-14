class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { commentId, owner, threadId } = payload;
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.verifyCommentOwner({ commentId, owner });
    await this._commentRepository.deleteComment(commentId);
  }

  _verifyPayload({ owner, commentId, threadId }) {
    if (!owner || !commentId || !threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof owner !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = AddCommentUseCase;
