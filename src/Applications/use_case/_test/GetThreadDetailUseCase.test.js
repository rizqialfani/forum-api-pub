const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const useCasePayload = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title Sample',
      body: 'Thread Body Sample',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user123',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'user123',
        date: '2021-08-08T07:22:33.555Z',
        content: 'Comment Content Sample',
        is_delete: 0,
      },
      {
        id: 'comment-234',
        username: 'user234',
        date: '2021-08-08T07:26:21.338Z',
        content: 'Deleted Comment Content Sample',
        is_delete: 1,
      },
    ];

    const expectedThreadDetail = {
      thread: {
        id: 'thread-123',
        title: 'Thread Title Sample',
        body: 'Thread Body Sample',
        date: '2021-08-08T07:19:09.775Z',
        username: 'user123',
        comments: [
          {
            id: 'comment-123',
            username: 'user123',
            date: '2021-08-08T07:22:33.555Z',
            content: 'Comment Content Sample',
          },
          {
            id: 'comment-234',
            username: 'user234',
            date: '2021-08-08T07:26:21.338Z',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    };

    /** creating dependency of use case */
    const expectedThreadRepository = new ThreadRepository();
    const expectedCommentRepository = new CommentRepository();

    /** mocking needed function */
    expectedThreadRepository.verifyThreadIsExist = jest.fn(() => Promise.resolve());
    expectedThreadRepository.getThreadDetail = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    expectedCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** creating use case instance */
    const threadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: expectedThreadRepository,
      commentRepository: expectedCommentRepository,
    });

    // Action
    const threadDetail = await threadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(expectedThreadRepository.getThreadDetail).toHaveBeenCalledWith(useCasePayload);

    expect(expectedCommentRepository.getThreadComments).toHaveBeenCalledWith(useCasePayload);

    expect(threadDetail).toStrictEqual(expectedThreadDetail);
  });
});
