const { users: sql } = require('../sql');

const cs = {}; // Reusable ColumnSet objects.

class UsersRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
    // set-up all ColumnSet objects:
    createColumnsets(pgp);
  }

  /**
   * Creates table users
   */
  async create() {
    return this.db.none(sql.create);
  }

  /**
   * Drops table users
   */
  async drop() {
    return this.db.none(sql.drop);
  }

  /**
   * Inserts a new user in the database and returns it.
   * @param {User} user 
   */
  async add(user) {
    return this.db.one(`${this.pgp.helpers.insert(user, cs.insert)} RETURNING *`);
  }

  /**
   * Updates a user in the database and returns it
   * @param {User} user 
   */
  async update(user) {
    const query = `${this.pgp.helpers.update(user, cs.update)} WHERE id = ${user.id} RETURNING *`
    return this.db.one(query);
  }

  /**
   * Tries to delete a user by id
   * @param {Number} id 
   */
  async delete(id) {
    return this.db.result(sql.delete, { id });
  }

  /**
   * Tries to delete a user by id
   * @param {Number} id 
   */
  async findById(id) {
    return this.db.oneOrNone(sql.findById, { id });
  }

  /**
   * Tries to find a user from email
   * @param {String} email 
   */
  async findByEmail(email) {
    return this.db.oneOrNone(sql.findByEmail, { email });
  }

}

function createColumnsets(pgp) {
  if (!cs.insert) {
    cs.insert = new pgp.helpers.ColumnSet([
      { name: 'first_name', prop: 'firstName', skip(col) { return str(col) } },
      { name: 'last_name', prop: 'lastName', skip(col) { return str(col) } },
      { name: 'email', skip(col) { return str(col) } },
      { name: 'password', skip(col) { return str(col) } }
    ], {
      table: 'users'
    });
    cs.update = cs.insert.extend(['?id']);
  }
  return cs;
}

module.exports = UsersRepository;
