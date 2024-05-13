/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan contraint FK pada kolom thread_id (tabel comments) terhadap kolom id (tabel threads)
  pgm.addConstraint('comments', 'fk_comments.threads_id__users.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_comments.threads_id__users.id pada tabel comments
  pgm.dropConstraint('comments', 'fk_comments.threads_id__users.id');
};
