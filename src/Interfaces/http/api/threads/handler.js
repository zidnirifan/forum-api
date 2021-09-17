const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadByIdHandler =
      this.getDetailThreadByIdHandler.bind(this);
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

  async getDetailThreadByIdHandler({ params }) {
    const getDetailThreadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    );
    const thread = await getDetailThreadUseCase.execute(params.threadId);
    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = ThreadsHandler;
