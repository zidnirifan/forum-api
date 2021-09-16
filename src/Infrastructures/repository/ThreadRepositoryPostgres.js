const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, NOW(), $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const { rows } = await this._pool.query(query);
    return new AddedThread(...rows);
  }

  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Thread tidak ditemukan');
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: `SELECT T.id, T.title, T.body, T.date, U.username
              FROM threads AS T JOIN users AS U ON U.id = T.owner
              WHERE T.id = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
