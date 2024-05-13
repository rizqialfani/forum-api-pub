const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread: threadId } = new ThreadDetail(useCasePayload);
    await this._threadRepository.verifyThreadIsExist(threadId);
    const thread = await this._threadRepository.getThreadDetail(threadId);
    const getThreadComments = await this._commentRepository.getThreadComments(threadId);
    thread.comments = new CommentDetail({ comments: getThreadComments }).comments;
    return {
      thread,
    };
  }
}

module.exports = GetThreadDetailUseCase;
