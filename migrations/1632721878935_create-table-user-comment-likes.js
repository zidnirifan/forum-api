exports.up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'user_comment_likes',
    'unique_comment_id_and_user_id',
    'UNIQUE(comment_id, user_id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};
