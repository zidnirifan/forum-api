const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    await this._commentRepository.isCommentExist(payload.commentId);
    const newReply = new NewReply(payload);
    const addedReply = await this._replyRepository.addReply(newReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
