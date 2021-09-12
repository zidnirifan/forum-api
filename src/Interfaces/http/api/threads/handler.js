const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const { id: owner } = auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ ...payload, owner });

    return h
      .response({
        status: 'success',
        data: { addedThread },
      })
      .code(201);
  }
}

module.exports = ThreadsHandler;
