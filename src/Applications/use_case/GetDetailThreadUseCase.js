const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    const detailThread = await this._threadRepository.getDetailThreadById(
      threadId
    );
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    return new DetailThread({ ...detailThread, comments });
  }
}

module.exports = GetDetailThreadUseCase;
