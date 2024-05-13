/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan contraint FK pada kolom owner (tabel threads) terhadap kolom id (tabel users)
  pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_threads.owner_users.id pada tabel threads
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
};
