const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newThread = new NewThread(payload);
    const addedThread = await this._threadRepository.addThread(newThread);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
