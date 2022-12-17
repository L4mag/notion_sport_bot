const connectToDb = require('./utils/connectToDb')

const createExerciseSetTableSql =
  'CREATE TABLE IF NOT EXISTS exercise_set (\n' +
  'id INTEGER PRIMARY KEY,\n' +
  'name TEXT NOT NULL,\n' +
  'last_update_datetime NUMERIC NOT NULL\n' +
  ');'

const createExercisesTableSql =
  'CREATE TABLE IF NOT EXISTS exercise (\n' +
  'id INTEGER PRIMARY KEY,\n' +
  'ex_set_id INTEGER NOT NULL,\n' +
  'count INTEGER DEFAULT 0,\n' +
  'last_update_datetime NUMERIC NOT NULL,\n' +
  'FOREIGN KEY (ex_set_id) REFERENCES exercise_set (id) ON DELETE CASCADE ON UPDATE NO ACTION\n' +
  ');'

const createLastSetCountTableSql =
  'CREATE TABLE IF NOT EXISTS last_set_count (\n' +
  'ex_id INTEGER NOT NULL,\n' +
  'ex_set_id INTEGER NOT NULL,\n' +
  'count integer DEFAULT 0,\n' +
  'last_update_datetime NUMERIC NOT NULL,\n' +
  'PRIMARY KEY(ex_id, ex_set_id),\n' +
  'FOREIGN KEY (ex_id) REFERENCES exercise (id) ON DELETE CASCADE ON UPDATE NO ACTION,\n' +
  'FOREIGN KEY (ex_set_id) REFERENCES exercise_set (id) ON DELETE CASCADE ON UPDATE NO ACTION\n' +
  ');'

const initSqls = new Map()

initSqls.set('exercise_set', createExerciseSetTableSql)
initSqls.set('exercise', createExercisesTableSql)
initSqls.set('last_set_count', createLastSetCountTableSql)

const initializeDb = () => {
  const db = connectToDb()

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

initializeDb()

module.exports = initializeDb
