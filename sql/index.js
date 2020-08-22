const { QueryFile } = require('pg-promise');
const { join: joinPath } = require('path');

module.exports = {
  users: {
    create: sql('users/create.sql'),
    drop: sql('users/drop.sql'),
    add: sql('users/add.sql'),
    findByEmail: sql('users/findByEmail.sql'),
    findById: sql('users/findById.sql')
  }
};

// Helper for linking to external query files;
function sql(file) {
  const fullPath = joinPath(__dirname, file);
  // minifying the SQL;
  const options = {
    minify: true
  };
  const qf = new QueryFile(fullPath, options);
  if (qf.error) {
    console.error(qf.error);
  }
  return qf;
}
