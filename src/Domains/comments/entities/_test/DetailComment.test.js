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
      is_delete: 'true',
    };

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should change content value to **komentar telah dihapus** when is_deleted is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      content: 'comment',
      is_delete: true,
    };

    const { content } = new DetailComment(payload);
    expect(content).toEqual('**komentar telah dihapus**');
  });

  it('should not change content value to **komentar telah dihapus** when is_delete is false', () => {
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      content: 'comment',
      is_delete: false,
    };

    const { content } = new DetailComment(payload);
    expect(content).toEqual(payload.content);
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      content: 'comment',
      is_delete: false,
    };

    const { id, content, username, date } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
