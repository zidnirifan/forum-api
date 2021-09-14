class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, commentId, threadId } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.threadId = threadId;
  }

  _verifyPayload({ owner, commentId, threadId }) {
    if (!owner || !commentId || !threadId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof owner !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
