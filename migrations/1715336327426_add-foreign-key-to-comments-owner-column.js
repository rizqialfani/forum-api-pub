/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan contraint FK pada kolom owner (tabel comments) terhadap kolom id (tabel users)
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_comments.owner_users.id pada tabel comments
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
};
