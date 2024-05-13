const CreatedComment = require('../CreatedComment');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Content Comment Sample',
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: 'Content Comment Test',
      owner: 123,
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should createdComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Content Comment Test',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new CreatedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
