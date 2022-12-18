const dbConnect = require('./util/dbConnect')

const populateLastExerciseCount = () => {
  const db = dbConnect()

  const sql =
    `INSERT INTO last_set_count\n` +
    `(ex_id, ex_set_id, count, last_update_datetime)\n` +
    `SELECT ex.id, ex_set.id, 0, datetime('now')\n` +
    `FROM exercise ex\n` +
    `JOIN exercise_set ex_set ON ex.ex_set_id = ex_set.id\n`

  db.serialize(() => {
    db.run(sql, (err) => {
      if (err) {
        return console.error(err.message)
      }
    })
  })
  db.close()
}

module.exports = populateLastExerciseCount
