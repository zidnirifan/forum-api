class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, date, is_delete } = payload;

    this.id = id;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.date = date;
  }

  _verifyPayload({ id, content, username, date, is_delete }) {
    if (!id || !content || !username || !date || is_delete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
