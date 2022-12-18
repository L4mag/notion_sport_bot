const dbConnect = require('./util/dbConnect')

const checkExercisesUpdates = async (
  dateToCompare,
  updateExercises,
  updateData
) => {
  const db = dbConnect()

  const selectLastUpdateDateSql = `SELECT max(ex.last_update_datetime) FROM exercise_set es
  join exercise ex ON ex.ex_set_id = es.id
  WHERE es.name = \'${updateData.setName}\'`

  db.serialize(() => {
    db.get(selectLastUpdateDateSql, (err, row) => {
      if (err) {
        return console.error(err.message)
      }
      if (!row) {
        return updateData.exercises.map((ex) => {
          updateExercises(ex, updateData.lastEditedTime)
        })
      }

      const dateFromDb = new Date(row.last_update_datetime)
      const dateToCompareF = new Date(dateToCompare)

      if (
        dateFromDb.getTime() === dateToCompareF.getTime()
      ) {
        return console.log('Exercises is up to date')
      }

      updateData.exercises.map((ex) => {
        updateExercises(ex, updateData.lastEditedTime)
      })
    })
  })
  db.close()
}

module.exports = checkExercisesUpdates
