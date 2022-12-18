const dbInsert = require('./util/dbInsert')

const insertExerciseSet = async (
  setName,
  lastEditedTime
) => {
  return dbInsert(
    'exercise_set',
    new Map([
      ['name', setName],
      ['last_update_datetime', lastEditedTime],
    ])
  )
}

module.exports = insertExerciseSet
