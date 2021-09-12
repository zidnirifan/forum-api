const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const newComment = new NewComment(payload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
