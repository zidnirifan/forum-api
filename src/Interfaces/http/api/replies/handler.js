const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
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

  async deleteReplyHandler({ params, auth }) {
    const { id: owner } = auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute({ ...params, owner });

    return { status: 'success' };
  }
}

module.exports = RepliesHandler;
