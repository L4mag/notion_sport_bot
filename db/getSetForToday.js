const dbConnect = require('./util/dbConnect')

const getSetForToday = (setId) => {
  const db = dbConnect()

  const sql =
    `SELECT e.* FROM exercise_set es\n` +
    `JOIN exercise e ON e.ex_set_id = es.id\n` +
    `WHERE es.id = es.for_today = 'true'\n` +
    `AND es.name <> 'Daily'`

  db.serialize(() => {
    db.run(sql, (err) => {
      if (err) {
        return console.error(err.message)
      }
    })
  })
  db.close()
}

module.exports = getSetForToday
