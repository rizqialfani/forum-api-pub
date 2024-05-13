class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const comments = this._remapComment(payload);
    this.comments = comments;
  }

  _verifyPayload({ comments }) {
    if (!comments) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!Array.isArray(comments)) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _remapComment({ comments }) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));
  }
}

module.exports = CommentDetail;
