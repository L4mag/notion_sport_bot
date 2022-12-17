const dbConnect = require('./util/dbConnect')

const checkExercisesUpdates = async (
  dateToCompare,
  updateExercises,
  updateData
) => {
  const db = dbConnect()

  const selectLastUpdateDateSql = `SELECT last_update_datetime FROM exercise\n`

  db.serialize(() => {
    db.all(selectLastUpdateDateSql, (err, rows) => {
      if (err) {
        return console.error(err.message)
      }

      const maxDateFromDb = Math.max(
        ...rows.map((r) => new Date(r.last_update_datetime))
      )

      if (dateToCompare === maxDateFromDb) {
        return console.log('Exercises is up to date')
      }

      updateExercises(updateData)
    })
  })
  db.close()
}

module.exports = checkExercisesUpdates
