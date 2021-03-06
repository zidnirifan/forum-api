const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.isThreadExist(payload.threadId);
    await this._commentRepository.isCommentExist(payload.commentId);
    const newReply = new NewReply(payload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
