const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
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
}

module.exports = CommentsHandler;
