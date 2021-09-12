const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

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
}

module.exports = CommentRepositoryPostgres;
