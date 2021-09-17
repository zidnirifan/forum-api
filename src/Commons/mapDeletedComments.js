const mapDeletedComments = (comments) =>
  comments.map(({ is_delete, content, ...rest }) =>
    is_delete
      ? { content: '**komentar telah dihapus**', ...rest }
      : { content, ...rest }
  );

module.exports = mapDeletedComments;
