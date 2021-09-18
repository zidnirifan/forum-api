const mapDeletedReplies = (replies) =>
  replies.map(({ is_delete, content, ...rest }) =>
    is_delete
      ? { content: '**balasan telah dihapus**', ...rest }
      : { content, ...rest }
  );

module.exports = mapDeletedReplies;
