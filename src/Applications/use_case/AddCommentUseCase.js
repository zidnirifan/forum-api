const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.isThreadExist(payload.threadId);
    const newComment = new NewComment(payload);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
