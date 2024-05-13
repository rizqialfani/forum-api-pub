class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const thread = payload;
    this.thread = thread;
  }

  _verifyPayload(payload) {
    if (!payload) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetail;
