const dbInsert = require('./util/dbInsert')

const insertExerciseSet = (setName) => {
  return dbInsert(
    'exercise_set',
    new Map([['name', setName]])
  )
}

module.exports = insertExerciseSet
