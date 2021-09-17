const mapDeletedComments = require('../mapDeletedComments');

describe('mapDeletedComments', () => {
  it('should change content value to **komentar telah dihapus** when is_delete is true', () => {
    const comments = [
      {
        content: 'title',
        id: 'comment-123',
        date: '2021-09-17T06:32:29.631Z',
        username: 'dicoding',
        is_delete: true,
      },
    ];

    const commentsMapped = mapDeletedComments(comments);
    expect(commentsMapped[0].content).toEqual('**komentar telah dihapus**');
  });

  it('should not change content value to **komentar telah dihapus** when is_delete is false', () => {
    const comments = [
      {
        content: 'title',
        id: 'comment-123',
        date: '2021-09-17T06:32:29.631Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];

    const commentsMapped = mapDeletedComments(comments);
    expect(commentsMapped[0].content).toEqual(comments[0].content);
  });
});
