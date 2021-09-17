class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, date, replies } = payload;

    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.replies = replies;
  }

  _verifyPayload({ id, content, username, date, replies }) {
    if (!id || !content || !username || !date || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      !Array.isArray(replies)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
