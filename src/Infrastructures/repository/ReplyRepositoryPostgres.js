const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, NOW(), $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, commentId],
    };

    const { rows } = await this._pool.query(query);
    return new AddedReply(...rows);
  }
}

module.exports = ReplyRepositoryPostgres;
