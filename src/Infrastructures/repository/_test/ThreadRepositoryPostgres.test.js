const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const createThread = new CreateThread({
        title: 'Title Thread Sample',
        body: 'Body Thread Sample',
        owner: 'user-123',

      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const createThread = new CreateThread({
        title: 'Title Thread Sample',
        body: 'Body Thread Sample',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'Title Thread Sample',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadIsExist function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukkan user baru dengan id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // memasukkan thread baru dengan id thread-123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadDetail('thread-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-234' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-234' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should get thread detail correctly', async () => {
      // Arrange
      const threadValue = {
        id: 'thread-123',
        title: 'Thread Title Sample',
        body: 'Thread Body Sample',
        owner: 'user-123',
        date: 'Thread Date Sample',
      };

      const userValue = {
        id: 'user-123',
        username: 'user123',
      };

      await UsersTableTestHelper.addUser(userValue);
      await ThreadsTableTestHelper.addThread(threadValue);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.getThreadDetail(threadValue.id);

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadValue.id);
      expect(thread.title).toEqual(threadValue.title);
      expect(thread.body).toEqual(threadValue.body);
      expect(thread.date).toEqual(threadValue.date);
      expect(thread.username).toEqual(userValue.username);
    });
  });
});
