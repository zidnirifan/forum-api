exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'CHAR(23)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    owner: {
      type: 'CHAR(21)',
      references: '"users"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
