const dbConnect = require('./util/dbConnect')

const populateLastExerciseCount = async () => {
  const db = dbConnect()

  const sql = `INSERT INTO last_set_count
    (ex_id, ex_set_id, count, last_update_datetime)
    SELECT ex.id, ex_set.id, 0, \'${new Date().toISOString()}\'
    FROM exercise ex
    JOIN exercise_set ex_set ON ex.ex_set_id = ex_set.id`

  db.serialize(() => {
    db.run(sql, (err) => {
      if (err) {
        return console.error(err.message)
      }

      console.log('Sets counts have been populated')
    })
  })

  db.close()
}

module.exports = populateLastExerciseCount
