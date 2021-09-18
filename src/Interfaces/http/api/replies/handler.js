const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler({ payload, auth, params }, h) {
    const { id: owner } = auth.credentials;
    const { commentId, threadId } = params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      ...payload,
      owner,
      commentId,
      threadId,
    });

    return h
      .response({
        status: 'success',
        data: { addedReply },
      })
      .code(201);
  }
}

module.exports = RepliesHandler;
