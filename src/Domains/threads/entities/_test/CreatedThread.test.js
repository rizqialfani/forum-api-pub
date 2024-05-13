const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Title Thread Sample',
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: 'Title Thread Test',
      owner: 123,
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should createdThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title Thread Test',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new CreatedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
