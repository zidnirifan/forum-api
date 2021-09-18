const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const mapDeletedReplies = require('../../Commons/mapDeletedReplies');

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

  async deleteReply(commentId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT R.id, R.content, R.date, R.is_delete, U.username
              FROM replies AS R JOIN users AS U
              ON U.id = R.owner
              WHERE R.comment_id = $1
              ORDER BY R.date ASC`,
      values: [commentId],
    };

    const { rows, rowCount } = await this._pool.query(query);
    return rowCount ? mapDeletedReplies(rows) : [];
  }
}

module.exports = ReplyRepositoryPostgres;
