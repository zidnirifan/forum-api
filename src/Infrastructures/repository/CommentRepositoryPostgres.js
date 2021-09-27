const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, NOW(), $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId],
    };

    const { rows } = await this._pool.query(query);
    return new AddedComment(...rows);
  }

  async isCommentExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Comment tidak ditemukan');
  }

  async verifyCommentOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);

    const { owner: commentOwner } = rows[0];

    if (commentOwner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik comment ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT C.id, C.content, C.date, C.is_delete, U.username
              FROM comments AS C JOIN users AS U
              ON U.id = C.owner
              WHERE C.thread_id = $1
              ORDER BY C.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows.map((comment) => new DetailComment(comment));
  }

  async isCommentLiked({ commentId, userId }) {
    const query = {
      text: `SELECT * from user_comment_likes 
              WHERE comment_id = $1 AND user_id = $2`,
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    return !!rowCount;
  }
}

module.exports = CommentRepositoryPostgres;
