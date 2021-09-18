exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    comment_id: {
      type: 'VARCHAR(30)',
      references: '"comments"',
      onDelete: 'cascade',
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
