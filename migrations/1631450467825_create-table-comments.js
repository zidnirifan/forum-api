exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(30)',
      references: '"users"',
      onDelete: 'cascade',
    },
    threadId: {
      type: 'VARCHAR(30)',
      references: '"threads"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
