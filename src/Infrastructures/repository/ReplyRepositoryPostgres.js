const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

  async isReplyExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Balasan tidak ditemukan');
  }

  async verifyReplyOwner({ replyId, owner }) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rows } = await this._pool.query(query);

    const replyOwner = rows[0].owner;

    if (replyOwner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik balasan ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
