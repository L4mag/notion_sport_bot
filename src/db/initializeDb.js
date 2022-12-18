const dbConnect = require('./util/dbConnect')

const createExerciseSetTableSql = `CREATE TABLE IF NOT EXISTS exercise_set (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  for_today TEXT DEFAULT 'false',
  type TEXT,
  last_update_datetime NUMERIC NOT NULL
  );`

const createExerciseTableSql = `CREATE TABLE IF NOT EXISTS exercise (
  id INTEGER PRIMARY KEY,
  ex_set_id INTEGER,
  name TEXT NOT NULL UNIQUE,
  last_update_datetime NUMERIC NOT NULL,
  FOREIGN KEY (ex_set_id) REFERENCES exercise_set (id) ON DELETE CASCADE ON UPDATE NO ACTION
  );`

const createLastSetCountTableSql = `CREATE TABLE IF NOT EXISTS last_set_count (
  ex_id INTEGER NOT NULL,
  ex_set_id INTEGER NOT NULL,
  count integer DEFAULT 0,
  last_update_datetime NUMERIC NOT NULL,
  PRIMARY KEY(ex_id, ex_set_id),
  FOREIGN KEY (ex_id) REFERENCES exercise (id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (ex_set_id) REFERENCES exercise_set (id) ON DELETE CASCADE ON UPDATE NO ACTION
  );`

const initSqls = new Map()

initSqls.set('exercise_set', createExerciseSetTableSql)
initSqls.set('exercise', createExerciseTableSql)
initSqls.set('last_set_count', createLastSetCountTableSql)

const initializeDb = async () => {
  const db = dbConnect()

  db.serialize(() => {
    initSqls.forEach((sql, tableName) => {
      db.run(sql, (err) => {
        if (err) {
          return console.error(err.message)
        }
        console.log(`table ${tableName} has been created.`)
      })
    })
  })

  db.close()
}

module.exports = initializeDb
