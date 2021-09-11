const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

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
}

module.exports = ThreadRepositoryPostgres;
