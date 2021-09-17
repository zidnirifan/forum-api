const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment',
      username: 'user',
    };

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: true,
      date: 99,
      content: 123,
      replies: {},
    };

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      content: 'comment',
      replies: [
        { id: 'reply-123', content: 'reply', date: '23456', username: 'user' },
      ],
    };

    const { id, content, username, date, replies } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(replies).toStrictEqual(payload.replies);
  });
});
