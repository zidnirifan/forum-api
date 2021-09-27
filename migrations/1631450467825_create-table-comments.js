exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
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
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'cascade',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: '"threads"',
      onDelete: 'cascade',
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
