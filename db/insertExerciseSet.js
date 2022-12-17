const dbInsert = require('./utils/dbInsert')

const insertExerciseSet = (setName) => {
  dbInsert('exercise_set', new Map([['name', setName]]))
}

module.exports = insertExerciseSet
