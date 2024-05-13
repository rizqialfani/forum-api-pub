const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const createComment = new CreateComment({
        content: 'Content Comment Sample',
        owner: 'user-123',
        threadId: 'thread-123',

      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const createComment = new CreateComment({
        content: 'Content Comment Sample',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'Content Comment Sample',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentIsExist function', () => {
    it('should throw NotFound Error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExist('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when comment is owned', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukkan user baru dengan id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // memasukkan thread baru dengan id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExist(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw Authorization Error when comment was not owned', async () => {
      // Arrange
      const commentId = 'comment-id';
      const ownerId = 'user-123';
      const userId = 'user-456';
      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw Authorization Error when comment was owned', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId }); // memasukkan user baru dengan id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // memasukkan thread baru dengan id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should throw NotFound Error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExist('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should delete comment by id correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukkan user baru dengan id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // memasukkan thread baru dengan id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getThreadComments function', () => {
    it('should get thread comments correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        date: '2021-08-08T07:26:21.338Z', // expected 2nd comment
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        threadId,
        date: '2021-08-08T07:22:33.555Z', // expected 1st comment
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getThreadComments(threadId);

      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-234');
      expect(comments[0].date).toEqual('2021-08-08T07:22:33.555Z');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual('Comment Content Sample');
      expect(comments[0].is_delete).toEqual(false);
      expect(comments[1].id).toEqual('comment-123');
      expect(comments[1].date).toEqual('2021-08-08T07:26:21.338Z');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('Comment Content Sample');
      expect(comments[1].is_delete).toEqual(false);
    });

    it('should return empty array if thread has no comments', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getThreadComments(threadId);

      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(0);
    });
  });
});
