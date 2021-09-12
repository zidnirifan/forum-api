const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment',
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: true,
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'comment',
      owner: 'user-123',
    };

    const { content, owner } = new NewComment(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
