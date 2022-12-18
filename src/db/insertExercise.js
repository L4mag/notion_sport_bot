const dbInsert = require('./util/dbInsert')

const insertExercise = (exercise, lastEditedTime) => {
  return dbInsert(
    'exercise',
    new Map([
      ['name', exercise],
      ['last_update_datetime', lastEditedTime],
    ])
  )
}

module.exports = insertExercise
