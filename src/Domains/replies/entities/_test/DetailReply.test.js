const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'reply',
      username: 'user',
    };

    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      username: true,
      date: 99,
      content: 123,
      is_delete: 'true',
    };

    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should change content value to **balasan telah dihapus** when is_delete is true', () => {
    const payload = {
      id: 'reply-123',
      username: 'user',
      date: new Date(),
      content: 'reply',
      is_delete: true,
    };

    const { content } = new DetailReply(payload);
    expect(content).toEqual('**balasan telah dihapus**');
  });

  it('should not change content value to **balasan telah dihapus** when is_delete is false', () => {
    const payload = {
      id: 'reply-123',
      username: 'user',
      date: new Date(),
      content: 'reply',
      is_delete: false,
    };

    const { content } = new DetailReply(payload);
    expect(content).toEqual(payload.content);
  });

  it('should create DetailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'user',
      date: new Date(),
      content: 'reply',
      is_delete: false,
    };

    const { id, content, username, date } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
