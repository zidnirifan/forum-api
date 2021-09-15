const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler({ payload, auth, params }, h) {
    const { id: owner } = auth.credentials;
    const { threadId } = params;
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute({
      ...payload,
      owner,
      threadId,
    });

    return h
      .response({
        status: 'success',
        data: { addedComment },
      })
      .code(201);
  }

  async deleteCommentHandler({ params, auth }) {
    const { id: owner } = auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute({ ...params, owner });

    return { status: 'success' };
  }
}

module.exports = CommentsHandler;
