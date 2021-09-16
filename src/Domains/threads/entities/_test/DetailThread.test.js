const DetailThread = require('../DetailThread');

describe('a DetailThraed entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body',
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: true,
      body: 77,
      date: 889,
      username: 'username',
      comments: true,
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'username',
      comments: [
        { id: 'id', username: 'username', date: 'date', content: 'content' },
      ],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toStrictEqual(payload.comments);
  });
});
