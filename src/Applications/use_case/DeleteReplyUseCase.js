class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { replyId, commentId, owner, threadId } = payload;
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);
    await this._replyRepository.isReplyExist(replyId);
    await this._replyRepository.verifyReplyOwner({ replyId, owner });
    await this._replyRepository.deleteReply(replyId);
  }

  _verifyPayload({ replyId, owner, commentId, threadId }) {
    if (!replyId || !owner || !commentId || !threadId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof replyId !== 'string' ||
      typeof owner !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
