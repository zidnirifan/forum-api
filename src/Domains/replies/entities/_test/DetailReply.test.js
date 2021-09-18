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
    };

    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DetailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'user',
      date: new Date(),
      content: 'reply',
    };

    const { id, content, username, date } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
