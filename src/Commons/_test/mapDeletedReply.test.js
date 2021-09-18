const mapDeletedReply = require('../mapDeletedReply');

describe('mapDeletedReply', () => {
  it('should change content value to **balasan telah dihapus** when is_delete is true', () => {
    const replies = [
      {
        content: 'reply',
        id: 'reply-123',
        date: '2021-09-17T06:32:29.631Z',
        username: 'dicoding',
        is_delete: true,
      },
    ];

    const repliesMapped = mapDeletedReply(replies);
    expect(repliesMapped[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should not change content value to **balasan telah dihapus** when is_delete is false', () => {
    const replies = [
      {
        content: 'reply',
        id: 'reply-123',
        date: '2021-09-17T06:32:29.631Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];

    const repliesMapped = mapDeletedReply(replies);
    expect(repliesMapped[0].content).toEqual(replies[0].content);
  });
});
